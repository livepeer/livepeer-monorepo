import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import Utils from 'web3-utils'
import { createApolloFetch } from 'apollo-fetch'

import schema from '../apollo'
import {
  mergeSchemas,
  introspectSchema,
  makeRemoteExecutableSchema,
} from 'graphql-tools'
import { getBlock, getBlockByNumber, getEstimatedBlockCountdown } from './utils'

export default async () => {
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
      `https://eth-${
        process.env.NETWORK === 'rinkeby' ? 'rinkeby' : 'mainnet'
      }.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
    )
    let contract = new web3.eth.Contract(
      _ctx.livepeer.config.contracts.LivepeerToken.abi,
      _ctx.livepeer.config.contracts.LivepeerToken.address,
    )

    return await contract.methods
      .balanceOf(_ctx.livepeer.config.contracts.Minter.address)
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
        price: {
          async resolve(_transcoder, _args, _context, _info) {
            const response = await fetch(
              `https://livepeer-pricing-tool.com/priceHistory/${_transcoder.id}`,
            )
            const prices = await response.json()
            return prices.length ? prices[0].PricePerPixel : 0
          },
        },
      },
      Delegator: {
        pendingStake: {
          async resolve(_delegator, _args, _ctx, _info) {
            const apolloFetch = createApolloFetch({ uri: process.env.SUBGRAPH })
            const { data } = await apolloFetch({
              query: `{ protocol(id: "0") { currentRound { id } } }`,
            })
            return await _ctx.livepeer.rpc.getPendingStake(
              _delegator.id.toString(),
              data.protocol.currentRound.id.toString(),
            )
          },
        },
        pendingFees: {
          async resolve(_delegator, _args, _ctx, _info) {
            const apolloFetch = createApolloFetch({ uri: process.env.SUBGRAPH })
            const { data } = await apolloFetch({
              query: `{ protocol(id: "0") { currentRound { id } } }`,
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
            const blockNumber = await getBlock()
            const isActive = blockNumber <= parseInt(_poll.endBlock)
            const totalStake = await getTotalStake(
              _ctx,
              isActive ? blockNumber : _poll.endBlock,
            )
            const totalVoteStake = Utils.toBN(
              _poll?.tally?.no ? _poll?.tally?.no : '0',
            ).add(Utils.toBN(_poll?.tally?.yes ? _poll?.tally?.yes : '0'))

            return Utils.toBN(totalStake)
              .sub(totalVoteStake)
              .toString()
          },
        },
        status: {
          async resolve(_poll, _args, _ctx, _info) {
            const blockNumber = await getBlock()
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
            const blockNumber = await getBlock()
            return blockNumber <= parseInt(_poll.endBlock)
          },
        },
        estimatedTimeRemaining: {
          async resolve(_poll, _args, _ctx, _info) {
            const blockNumber = await getBlock()
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
            const blockNumber = await getBlock()
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

  return merged
}
