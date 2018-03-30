/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
}

type MutationObj = {}

/** Resolvers */

/**
 * Approve an amount for an ERC20 token transfer
 * @param {MutationObj} obj
 * @param {string} type - The approval type
 * @param {string} amount - The approval amount
 * @return {Promise<TxReceipt>}
 */
export async function approve(
  obj: MutationObj,
  args: { type: string, amount: string },
  ctx: GQLContext,
): Promise<TxReceipt> {
  const { type, amount } = args
  switch (type) {
    case 'bond':
      return await ctx.livepeer.rpc.approveTokenBondAmount(amount)
      break
    default:
      throw new Error(`Approval type "${type}" is not supported.`)
  }
}

/**
 * Submits a bond transaction for a previously approved amount
 * @param {MutationObj} obj
 * @param {string} to - The ETH address of the delegate to bond to
 * @param {string} amount - The approval amount
 * @return {Promise<TxReceipt>}
 */
export async function bond(
  obj: MutationObj,
  args: { to: string, amount: string },
  ctx: GQLContext,
): Promise<TxReceipt> {
  const { to, amount } = args
  return await ctx.livepeer.rpc.bondApprovedTokenAmount(to, amount)
}

/**
 * Submits a claimEarnings transaction
 * @param {MutationObj} obj
 * @param {string} endRound - The round to claim earnings until
 * @return {Promise<TxReceipt>}
 */
export async function claimEarnings(
  obj: MutationObj,
  args: { endRound: string },
  ctx: GQLContext,
): Promise<TxReceipt> {
  const { endRound } = args
  return await ctx.livepeer.rpc.claimEarnings(endRound)
}

/**
 * Submits an unbond transaction
 * @param {MutationObj} obj
 * @return {Promise<TxReceipt>}
 */
export async function unbond(
  obj: MutationObj,
  args,
  ctx: GQLContext,
): Promise<TxReceipt> {
  return await ctx.livepeer.rpc.unbond()
}
