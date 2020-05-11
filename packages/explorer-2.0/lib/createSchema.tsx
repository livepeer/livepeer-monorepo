import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import Utils from 'web3-utils'

import schema from '../apollo'
import {
  mergeSchemas,
  introspectSchema,
  makeRemoteExecutableSchema,
} from 'graphql-tools'

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
    }
    extend type ThreeBoxSpace {
      transcoder: Transcoder
    }
    extend type Protocol {
      totalStake(block: String): String
    }
    extend type Delegator {
      pendingStake: String
      pendingFees: String
      tokenBalance: String
      ethBalance: String
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
  async function getTotalStake(_context, _blockNumber) {
    const Web3 = require('web3')
    let web3 = new Web3(
      `https://eth-${
        process.env.NETWORK === 'rinkeby' ? 'rinkeby' : 'mainnet'
      }.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
    )
    let contract = new web3.eth.Contract(
      _context.livepeer.config.contracts.LivepeerToken.abi,
      _context.livepeer.config.contracts.LivepeerToken.address,
    )

    return await contract.methods
      .balanceOf(_context.livepeer.config.contracts.Minter.address)
      .call({}, _blockNumber ? _blockNumber : null)
  }

  const merged = mergeSchemas({
    schemas: [subgraphSchema, schema, linkTypeDefs],
    resolvers: {
      Transcoder: {
        threeBoxSpace: {
          async resolve(_obj, _args, _context, _info) {
            const threeBoxSpace = await _info.mergeInfo.delegateToSchema({
              schema: schema,
              operation: 'query',
              fieldName: 'threeBoxSpace',
              args: {
                id: _obj.id,
              },
              context: _context,
              info: _info,
            })
            return threeBoxSpace
          },
        },
      },
      Delegator: {
        pendingStake: {
          async resolve(_delegator, _args, _context, _info) {
            const delegator = await _context.livepeer.rpc.getDelegator(
              _delegator.id,
            )
            return delegator.pendingStake
          },
        },
        pendingFees: {
          async resolve(_delegator, _args, _context, _info) {
            const delegator = await _context.livepeer.rpc.getDelegator(
              _delegator.id,
            )
            return delegator.pendingFees
          },
        },
        tokenBalance: {
          async resolve(_delegator, _args, _context, _info) {
            return await _context.livepeer.rpc.getTokenBalance(_delegator.id)
          },
        },
        ethBalance: {
          async resolve(_delegator, _args, _context, _info) {
            return await _context.livepeer.rpc.getEthBalance(_delegator.id)
          },
        },
      },
      Protocol: {
        totalStake: {
          async resolve(_protocol, _args, _context, _info) {
            return await getTotalStake(_context, _args.blockNumber)
          },
        },
      },
      Poll: {
        totalVoteStake: {
          async resolve(_poll, _args, _context, _info) {
            return Utils.toBN(_poll?.tally?.no ? _poll?.tally?.no : '0')
              .add(Utils.toBN(_poll?.tally?.yes ? _poll.tally.yes : '0'))
              .toString()
          },
        },
        totalNonVoteStake: {
          async resolve(_poll, _args, _context, _info) {
            const blockData = await _context.livepeer.rpc.getBlock('latest')
            const isActive =
              parseInt(blockData.number) <= parseInt(_poll.endBlock)
            const totalStake = await getTotalStake(
              _context,
              isActive ? blockData.number : _poll.endBlock,
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
          async resolve(_poll, _args, _context, _info) {
            const blockData = await _context.livepeer.rpc.getBlock('latest')
            const isActive =
              parseInt(blockData.number) <= parseInt(_poll.endBlock)
            const totalStake = await getTotalStake(
              _context,
              isActive ? blockData.number : _poll.endBlock,
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
          async resolve(_poll, _args, _context, _info) {
            const blockData = await _context.livepeer.rpc.getBlock('latest')
            return parseInt(blockData.number) <= parseInt(_poll.endBlock)
          },
        },
        estimatedTimeRemaining: {
          async resolve(_poll, _args, _context, _info) {
            const blockData = await _context.livepeer.rpc.getBlock('latest')
            if (parseInt(blockData.number) > parseInt(_poll.endBlock)) {
              return null
            }
            const countdownRaw = await fetch(
              `https://api${
                process.env.NETWORK === 'rinkeby' ? '-rinkeby' : ''
              }.etherscan.io/api?module=block&action=getblockcountdown&blockno=${
                _poll.endBlock
              }&apikey=${process.env.ETHERSCAN_API_KEY}`,
            )
            const countdownResponse = await countdownRaw.json()
            return parseInt(countdownResponse.result.EstimateTimeInSec)
          },
        },
        endTime: {
          async resolve(_poll, _args, _context, _info) {
            const blockData = await _context.livepeer.rpc.getBlock('latest')
            return parseInt(blockData.number) > parseInt(_poll.endBlock)
              ? blockData.timestamp
              : null
          },
        },
      },
    },
  })

  return merged
}
