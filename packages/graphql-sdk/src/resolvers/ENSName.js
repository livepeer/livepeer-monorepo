import { account as resolveAccount } from './Query'

/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
}

type ENSNameObj = {
  id: string,
}

/** Resolvers */

export function id(obj: ENSNameObj): string {
  return obj.id
}

export async function account(
  obj: ENSNameObj,
  args: ENSNameAccountArgs,
  ctx: GQLContext,
): Account {
  const address = await ctx.livepeer.rpc.getENSNameAddress(obj.id)
  return resolveAccount({}, { id: address }, ctx)
}
