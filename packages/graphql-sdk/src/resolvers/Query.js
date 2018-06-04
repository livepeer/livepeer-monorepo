import { transformJob } from '../utils'

/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
  etherscanApiKey: string,
}

type QueryObj = {}

type QueryAccountArgs = {
  id?: string,
}

type QueryBroadcasterArgs = {
  id?: string,
}

type QueryDelegatorArgs = {
  id?: string,
}

type QueryJobArgs = {
  id?: string,
}

type QueryJobsArgs = {
  broadcaster?: string,
  skip?: number,
  limit?: number,
}

type QueryRoundArgs = {}

type QueryTranscoderArgs = {
  id?: string,
}

/** Resolvers */

/**
 * Gets an Account by ID (ETH address)
 * @param {QueryObj} obj
 * @param {QueryAccountArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Account}
 */
export async function account(obj, args, ctx) {
  // Account field resolvers will fill in the rest
  return { id: args.id }
}

/**
 * Gets a Broadcaster by ID (ETH address)
 * @param {QueryObj} obj
 * @param {QueryBroadcasterArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Broadcaster}
 */
export async function broadcaster(
  obj: QueryObj,
  args: QueryBroadcasterArgs,
  ctx: GQLContext,
): Broadcaster {
  const { id } = args
  const { address, ...data } = await ctx.livepeer.rpc.getBroadcaster(id)
  const broadcaster = { ...data, id }
  return broadcaster
}

/**
 * Gets the currently authenticated user's ETH account address. ctx.account
 * @param {QueryObj} obj
 * @param {QueryAccountArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Account}
 */
export async function coinbase(obj, args, ctx) {
  return ctx.account || ''
}

/**
 * Gets a Delegator by ID (ETH address)
 * @param {QueryObj} obj
 * @param {QueryBroadcasterArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Broadcaster}
 */
export async function delegator(
  obj: QueryObj,
  args: QueryDelegatorArgs,
  ctx: GQLContext,
): Delegator {
  const { id } = args
  const { address, ...data } = await ctx.livepeer.rpc.getDelegator(id)
  const delegator = { ...data, id }
  return delegator
}

/**
 * Gets a Job by ID
 * @param {QueryObj} obj
 * @param {QueryJobArgs} args
 * @param {string} args.id - Job ID
 * @param {GQLContext} ctx
 * @return {Job}
 */
export async function job(
  obj: QueryObj,
  args: QueryJobArgs,
  ctx: GQLContext,
): Job {
  const { id } = args
  const result = await ctx.livepeer.rpc.getJob(id)
  const job = transformJob(result)
  return job
}

/**
 * Gets many Jobs
 * @param {QueryObj} obj
 * @param {QueryJobsArgs} args
 * @param {string} [args.broadcaster] - ETH address
 * @param {number} [args.skip=0] - The number of Jobs to skip
 * @param {number} [args.limit=100] - The max number onf Jobs to return
 * @param {GQLContext} ctx
 * @return {Array<Job>}
 */
export async function jobs(
  obj: QueryObj,
  args: QueryJobsArgs,
  ctx: GQLContext,
): Array<Job> {
  const { skip = 0, limit = 100, broadcaster = ctx.account, ..._args } = args
  const result = await ctx.livepeer.rpc.getJobs({
    broadcaster,
    ..._args,
  })
  const jobs = result.slice(skip, skip + limit).map(transformJob)
  return jobs
}

/**
 * Gets an Account by ID (ETH address). Uses ctx.accounts
 * @param {QueryObj} obj
 * @param {QueryAccountArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Account}
 */
export async function me(obj, args, ctx) {
  // Account field resolvers will fill in the rest
  const id = ctx.account
  if (!id) throw new Error(`No unlocked account is available`)
  return { id }
}

/**
 * Gets a the current round
 * @param {QueryObj} obj
 * @param {QueryRoundArgs} args
 * @param {GQLContext} ctx
 * @return {Round}
 */
export async function currentRound(
  obj: QueryObj,
  args: QueryRoundArgs,
  ctx: GQLContext,
): Round {
  const result = await ctx.livepeer.rpc.getCurrentRoundInfo()
  return result
}

/**
 * Gets all transactions to and from an account between the given start block and end block
 * @param {QueryObj} obj
 * @param {QueryTransactionsArgs} args
 * @param {string} [args.address] - ETH address that sent the transaction
 * @param {number} [args.startBlock=0] - The start block to search from
 * @param {number} [args.endBlock=99999999] - The end block to search to
 * @param {string} [args.skip] - Page number
 * @param {string} [args.limit] - Max records to return
 * @param {string} [args.sort='asc'] - 'asc' or 'desc'
 * @param {GQLContext} ctx
 * @return {Array<Transaction>}
 */
export async function transactions(
  obj: QueryObj,
  args: QueryTranscactionsArgs,
  ctx: GQLContext,
): Array<Transactions> {
  // console.log(ctx)
  const { account, etherscanApiKey, livepeer, persistor } = ctx
  const { cache } = persistor.cache
  const { config, utils } = livepeer
  const { contracts, eth } = config
  const {
    address,
    startBlock = 0,
    endBlock = 99999999,
    skip = 0,
    limit = 100,
    sort = 'desc',
  } = args
  const networkId = await eth.net_version()
  const rootUrl = `https://${
    networkId === '4' ? 'api-rinkeby' : 'api'
  }.etherscan.io/api`
  const queryString = `?module=account&action=txlist&address=${address}&startBlock=${startBlock}&endBlock=${endBlock}&page=${1 +
    skip}&offset=${limit}&sort=${sort}&apiKey=${etherscanApiKey}`
  const result = await fetch(rootUrl + queryString)
  const json = await result.json()
  const cacheData = cache.data.data
  // console.log(cache)
  const pendingTxRefs =
    cacheData.ROOT_QUERY[`pendingTransactions({"address":"${address}"})`] || []
  const pendingTxns = new Map(
    pendingTxRefs.map(x => [cacheData[x.id].id, cacheData[x.id]]),
  )
  const transactions = json.result.map(
    ({ hash: id, txreceipt_status: status, ...x }) => {
      const { contract, method, params } = utils.decodeContractInput(
        contracts,
        x.to,
        x.input,
      )
      if (pendingTxns.has(id)) {
        pendingTxns.delete(id)
      }
      return { ...x, id, status, contract, method, params }
    },
  )
  const values = [...pendingTxns.values()]
  return [
    ...values.map(({ __typename, params, ...x }) => {
      return {
        ...x,
        params: params.json,
      }
    }),
    ...transactions,
  ]
}

/**
 * Gets a Transcoder by ID (ETH address)
 * @param {QueryObj} obj
 * @param {QueryTranscoderArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Transcoder}
 */
export async function transcoder(
  obj: QueryObj,
  args: QueryTranscoderArgs,
  ctx: GQLContext,
): Transcoder {
  const { id } = args
  const { address, ...data } = await ctx.livepeer.rpc.getTranscoder(id)
  const transcoder = {
    ...transcoder,
    ...data,
    id,
  }
  return transcoder
}

/**
 * Gets many Transcoders
 * @param {QueryObj} obj
 * @param {QueryTranscodersArgs} args
 * @param {string} [args.broadcaster] - ETH address
 * @param {number} [args.skip=0] - The number of Transcoders to skip
 * @param {number} [args.limit=100] - The max number onf Transcoders to return
 * @param {GQLContext} ctx
 * @return {Array<Transcoder>}
 */
export async function transcoders(
  obj: QueryObj,
  args: QueryTranscodersArgs,
  ctx: GQLContext,
): Array<Transcoder> {
  const { skip = 0, limit = 100 } = args
  const result = await ctx.livepeer.rpc.getTranscoders()
  const transcoders = result
    .slice(skip, skip + limit)
    .map(({ address: id, ...x }) => ({ ...x, id }))
  return transcoders
}

/**
 * Gets a the protocol
 * @param {QueryObj} obj
 * @param {QueryRoundArgs} args
 * @param {GQLContext} ctx
 * @return {Round}
 */
export async function protocol(
  obj: QueryObj,
  args: QueryRoundArgs,
  ctx: GQLContext,
): Round {
  return {
    paused: await ctx.livepeer.rpc.getProtocolPaused(),
  }
}
