export async function account(_account, _args, ctx, _info) {
  const { rpc } = ctx.livepeer
  const { allowance } = await rpc.getDelegator(_args.id)
  return {
    id: _args.id,
    tokenBalance: await rpc.getTokenBalance(_args.id),
    ethBalance: await rpc.getEthBalance(_args.id),
    allowance: allowance,
  }
}

export async function protocol(_protocol, _args, ctx, _info) {
  const { rpc } = ctx.livepeer
  const { totalTokenSupply, totalBondedToken } = await rpc.getProtocol()
  return {
    inflation: await rpc.getInflation(),
    inflationChange: await rpc.getInflationChange(),
    totalTokenSupply,
    totalBondedToken,
  }
}
