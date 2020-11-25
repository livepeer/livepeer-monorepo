import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import Utils from 'web3-utils'
import { createApolloFetch } from 'apollo-fetch'
import { applyMiddleware } from 'graphql-middleware'
import graphqlFields from 'graphql-fields'

import schema from '../apollo'
import {
  mergeSchemas,
  introspectSchema,
  makeRemoteExecutableSchema,
} from 'graphql-tools'
import {
  getBlockByNumber,
  getEstimatedBlockCountdown,
  mergeObjectsInUnique,
} from './utils'

const Index = async () => {
  const subgraphServiceLink = new HttpLink({
    uri: process.env.SUBGRAPH,
    fetch,
  })

  const createSubgraphServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(subgraphServiceLink),
      link: subgraphServiceLink,
    })
    return executableSchema
  }

  const subgraphSchema = await createSubgraphServiceSchema()

  const linkTypeDefs = `
    extend type Transcoder {
      threeBoxSpace: ThreeBoxSpace
      price: Float
      scores: PerformanceLog
      successRates: PerformanceLog
      avgLatency: PerformanceLog
    }
    type PerformanceLog {
      global: Float
      fra: Float
      mdw: Float
      sin: Float
    }
    extend type ThreeBoxSpace {
      transcoder: Transcoder
    }
    extend type Protocol {
      totalStake(block: String): String
      totalTokenSupply: String
    }
    extend type Delegator {
      pendingStake: String
      pendingFees: String
    }
    extend type Poll {
      isActive: Boolean
      status: String
      totalVoteStake: String
      totalNonVoteStake: String
      estimatedTimeRemaining: Int
      endTime: Int
    }
    extend type Query {
      txs: [JSON]
    }
  `
  async function getTotalStake(_ctx, _blockNumber) {
    const Web3 = require('web3')
    let web3 = new Web3(
      process.env.NETWORK === 'rinkeby'
        ? process.env.RPC_URL_4
        : process.env.RPC_URL_1,
    )
    let contract = new web3.eth.Contract(
      _ctx.livepeer.config.contracts.LivepeerToken.abi,
      _ctx.livepeer.config.contracts.LivepeerToken.address,
    )

    return await contract.methods
      .balanceOf(
        _blockNumber < 10686186
          ? '0x8573f2f5a3bd960eee3d998473e50c75cdbe6828'
          : _ctx.livepeer.config.contracts.Minter.address,
      )
      .call({}, _blockNumber ? _blockNumber : null)
  }

  const merged = mergeSchemas({
    schemas: [subgraphSchema, schema, linkTypeDefs],
    resolvers: {
      Transcoder: {
        threeBoxSpace: {
          async resolve(_transcoder, _args, _ctx, _info) {
            const threeBoxSpace = await _info.mergeInfo.delegateToSchema({
              schema: schema,
              operation: 'query',
              fieldName: 'threeBoxSpace',
              args: {
                id: _transcoder.id,
              },
              context: _ctx,
              info: _info,
            })
            return threeBoxSpace
          },
        },
      },
      Delegator: {
        pendingStake: {
          async resolve(_delegator, _args, _ctx, _info) {
            const apolloFetch = createApolloFetch({
              uri: process.env.SUBGRAPH,
            })
            const { data } = await apolloFetch({
              query: `{
                protocol(id: "0") {
                  id
                  currentRound {
                    id
                  }
                }
              }`,
            })
            return await _ctx.livepeer.rpc.getPendingStake(
              _delegator.id.toString(),
              data.protocol.currentRound.id.toString(),
            )
          },
        },
        pendingFees: {
          async resolve(_delegator, _args, _ctx, _info) {
            const apolloFetch = createApolloFetch({
              uri: process.env.SUBGRAPH,
            })
            const { data } = await apolloFetch({
              query: `{
                protocol(id: "0") {
                  id
                  currentRound {
                    id
                  }
                }
              }`,
            })
            return await _ctx.livepeer.rpc.getPendingFees(
              _delegator.id,
              data.protocol.currentRound.id,
            )
          },
        },
      },
      Protocol: {
        totalStake: {
          async resolve(_protocol, _args, _ctx, _info) {
            return await getTotalStake(_ctx, _args.blockNumber)
          },
        },
        totalTokenSupply: {
          async resolve(_protocol, _args, _ctx, _info) {
            return await _ctx.livepeer.rpc.getTokenTotalSupply()
          },
        },
      },
      Poll: {
        totalVoteStake: {
          async resolve(_poll, _args, _ctx, _info) {
            return Utils.toBN(_poll?.tally?.no ? _poll?.tally?.no : '0')
              .add(Utils.toBN(_poll?.tally?.yes ? _poll.tally.yes : '0'))
              .toString()
          },
        },
        totalNonVoteStake: {
          async resolve(_poll, _args, _ctx, _info) {
            const { number: blockNumber } = await _ctx.livepeer.rpc.getBlock(
              'latest',
            )
            const isActive = blockNumber <= parseInt(_poll.endBlock)
            const totalStake = await getTotalStake(
              _ctx,
              isActive ? blockNumber : _poll.endBlock,
            )
            const totalVoteStake = Utils.toBN(
              _poll?.tally?.no ? _poll?.tally?.no : '0',
            ).add(Utils.toBN(_poll?.tally?.yes ? _poll?.tally?.yes : '0'))

            return Utils.toBN(totalStake).sub(totalVoteStake).toString()
          },
        },
        status: {
          async resolve(_poll, _args, _ctx, _info) {
            const { number: blockNumber } = await _ctx.livepeer.rpc.getBlock(
              'latest',
            )
            const isActive = blockNumber <= parseInt(_poll.endBlock)
            const totalStake = await getTotalStake(
              _ctx,
              isActive ? blockNumber : _poll.endBlock,
            )
            let noVoteStake = parseFloat(
              Utils.fromWei(_poll?.tally?.no ? _poll?.tally?.no : '0'),
            )
            let yesVoteStake = parseFloat(
              Utils.fromWei(_poll?.tally?.yes ? _poll?.tally?.yes : '0'),
            )
            let totalVoteStake = noVoteStake + yesVoteStake
            let totalSupport = isNaN(yesVoteStake / totalVoteStake)
              ? 0
              : (yesVoteStake / totalVoteStake) * 100
            let totalParticipation =
              (totalVoteStake / parseFloat(Utils.fromWei(totalStake))) * 100
            if (isActive) {
              return 'active'
            } else if (totalParticipation > _poll.quorum / 10000) {
              if (totalSupport > _poll.quota / 10000) {
                return 'passed'
              } else {
                return 'rejected'
              }
            } else {
              return 'Quorum not met'
            }
          },
        },
        isActive: {
          async resolve(_poll, _args, _ctx, _info) {
            const { number: blockNumber } = await _ctx.livepeer.rpc.getBlock(
              'latest',
            )
            return blockNumber <= parseInt(_poll.endBlock)
          },
        },
        estimatedTimeRemaining: {
          async resolve(_poll, _args, _ctx, _info) {
            const { number: blockNumber } = await _ctx.livepeer.rpc.getBlock(
              'latest',
            )
            if (blockNumber > parseInt(_poll.endBlock)) {
              return null
            }
            const countdownData = await getEstimatedBlockCountdown(
              _poll.endBlock,
            )
            return parseInt(countdownData.EstimateTimeInSec)
          },
        },
        endTime: {
          async resolve(_poll, _args, _ctx, _info) {
            const { number: blockNumber } = await _ctx.livepeer.rpc.getBlock(
              'latest',
            )
            if (blockNumber < parseInt(_poll.endBlock)) {
              return null
            }
            const endBlockData = await getBlockByNumber(_poll.endBlock)
            return endBlockData.timeStamp
          },
        },
      },
    },
  })

  // intercept and transform transcoder query responses with price data
  const queryMiddleware = {
    Query: {
      transcoder: async (resolve, parent, args, ctx, info) => {
        const selectionSet = Object.keys(graphqlFields(info))
        let transcoder = await resolve(parent, args, ctx, info)

        // if selection set does not include 'price', return transcoder as is, otherwise fetch and merge price
        if (!transcoder || !selectionSet.includes('price')) {
          return transcoder
        }

        let response = await fetch(
          `https://livepeer-pricing-tool.com/orchestratorStats`,
        )
        let transcodersWithPrice = await response.json()
        let transcoderWithPrice = transcodersWithPrice.filter(
          (t) => t.Address.toLowerCase() === args.id.toLowerCase(),
        )[0]
        transcoder['price'] = transcoderWithPrice?.PricePerPixel
          ? transcoderWithPrice?.PricePerPixel
          : 0
        return transcoder
      },
      transcoders: async (resolve, parent, args, ctx, info) => {
        const selectionSet = Object.keys(graphqlFields(info))
        const transcoders = await resolve(parent, args, ctx, info)
        let arr = []
        let performanceMetrics = []

        // if selection set includes 'price', return transcoders merge prices and performance metrics
        if (selectionSet.includes('price')) {
          // get price data
          let response = await fetch(
            `https://livepeer-pricing-tool.com/orchestratorStats`,
          )
          let transcodersWithPrice = await response.json()

          transcodersWithPrice.map((t) => {
            if (transcoders.filter((a) => a.id === t.Address).length > 0) {
              arr.push({
                id: t.Address,
                price: t.PricePerPixel,
              })
            }
          })
        }

        function avg(obj, key) {
          let arr = Object.values(obj)
          let sum = (prev, cur) => ({ [key]: prev[key] + cur[key] })
          return arr.reduce(sum)[key] / arr.length
        }

        if (selectionSet.includes('scores')) {
          let metricsResponse = await fetch(
            `https://leaderboard-serverless.livepeerorg.vercel.app/api/aggregated_stats?since=${ctx.since}`,
          )
          let metrics = await metricsResponse.json()

          for (const key in metrics) {
            if (transcoders.filter((a) => a.id === key).length > 0) {
              performanceMetrics.push({
                id: key,
                scores: {
                  global: avg(metrics[key], 'score'),
                  fra: metrics[key].FRA?.score,
                  mdw: metrics[key].MDW?.score,
                  sin: metrics[key].SIN?.score,
                },
                successRates: {
                  global: avg(metrics[key], 'success_rate'),
                  fra: metrics[key].FRA?.success_rate,
                  mdw: metrics[key].MDW?.success_rate,
                  sin: metrics[key].SIN?.success_rate,
                },
                avgLatency: {
                  global: avg(metrics[key], 'avg_latency'),
                  fra: metrics[key].FRA?.avg_latency,
                  mdw: metrics[key].MDW?.avg_latency,
                  sin: metrics[key].SIN?.avg_latency,
                },
              })
            }
          }
        }

        // merge results
        return mergeObjectsInUnique(
          [...transcoders, ...arr, ...performanceMetrics],
          'id',
        )
      },
    },
  }
  return applyMiddleware(merged, queryMiddleware)
}

export default Index
