import fetch from 'isomorphic-unfetch'
import LivepeerSDK from '@adamsoffer/livepeer-sdk'
import Box from '3box'

export async function account(_obj, _args, _ctx, _info) {
  const { rpc } = await LivepeerSDK({ gas: 2.1 * 1000000 })
  const { allowance } = await rpc.getDelegator(_args.id)
  return {
    id: _args.id,
    tokenBalance: await rpc.getTokenBalance(_args.id),
    ethBalance: await rpc.getEthBalance(_args.id),
    allowance: allowance,
  }
}

export async function protocol(_obj, _args, _ctx, _info) {
  const { rpc } = await LivepeerSDK({ gas: 2.1 * 1000000 })
  const { totalTokenSupply, totalBondedToken, paused } = await rpc.getProtocol()
  return {
    paused,
    inflation: await rpc.getInflation(),
    inflationChange: await rpc.getInflationChange(),
    totalTokenSupply,
    totalBondedToken,
  }
}

export async function getTxReceiptStatus(_obj, _args, _ctx, _info) {
  const data = await fetch(
    `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${_args.txHash}&apikey=${process.env.ETHERSCAN_API_KEY}`,
  )

  const response = await data.json()

  return {
    status: response.result.status,
  }
}

export async function threeBoxSpace(_obj, _args, _ctx, _info) {
  const { name, url, description, image, defaultProfile } = await Box.getSpace(
    _args.id,
    'livepeer',
  )

  return {
    id: _args.id,
    name,
    url,
    description,
    image,
    defaultProfile,
  }
}

export async function threeBox(_obj, _args, _ctx, _info) {
  const box = await Box.openBox(_args.id, _ctx.ethereumProvider)
  const addressLinks = await box.listAddressLinks()
  return {
    id: _args.id,
    did: box.DID,
    addressLinks,
  }
}
