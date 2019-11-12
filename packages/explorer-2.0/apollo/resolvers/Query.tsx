import fetch from 'isomorphic-unfetch';

export async function account(_account, _args, _ctx, _info) {
  const { rpc } = _ctx.livepeer
  const { allowance } = await rpc.getDelegator(_args.id)
  return {
    id: _args.id,
    tokenBalance: await rpc.getTokenBalance(_args.id),
    ethBalance: await rpc.getEthBalance(_args.id),
    allowance: allowance,
  }
}

export async function protocol(_protocol, _args, _ctx, _info) {
  const { rpc } = _ctx.livepeer
  const { totalTokenSupply, totalBondedToken, paused } = await rpc.getProtocol()
  return {
    paused,
    inflation: await rpc.getInflation(),
    inflationChange: await rpc.getInflationChange(),
    totalTokenSupply,
    totalBondedToken,
  }
}

export async function getTxReceiptStatus(_status, _args, _ctx, _info) {
  const data = await fetch(
    `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${_args.txHash}&apikey=${process.env.ETHERSCAN_API_KEY}`,
  )

  const response = await data.json()

  return {
    status: response.result.status,
  }
}
