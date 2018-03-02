import { transformJob } from '../utils'

/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
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
  const { skip = 0, limit = 100, ..._args } = args
  const result = await ctx.livepeer.rpc.getTranscoders()
  const transcoders = result
    .slice(skip, skip + limit)
    .map(({ address: id, ...x }) => ({ ...x, id }))
  return transcoders
}
