export async function account(_obj, _args, _ctx, _info) {
  const {
    allowance,
    pollCreatorAllowance,
  } = await _ctx.livepeer.rpc.getDelegator(_args.id.toLowerCase())

  return {
    id: _args.id,
    tokenBalance: await _ctx.livepeer.rpc.getTokenBalance(
      _args.id.toLowerCase(),
    ),
    ethBalance: await _ctx.livepeer.rpc.getEthBalance(_args.id.toLowerCase()),
    pollCreatorAllowance,
    allowance,
  }
}

export async function protocol(_obj, _args, _ctx, _info) {
  const {
    totalTokenSupply,
    totalBondedToken,
    paused,
  } = await _ctx.livepeer.rpc.getProtocol()
  return {
    paused,
    inflation: await _ctx.livepeer.rpc.getInflation(),
    inflationChange: await _ctx.livepeer.rpc.getInflationChange(),
    totalTokenSupply,
    totalBondedToken,
  }
}

export async function getTxReceiptStatus(_obj, _args, _ctx, _info) {
  const Utils = require('web3-utils')
  const txReceipt = await _ctx.livepeer.utils.getTxReceipt(
    _args.txHash,
    _ctx.livepeer.config.eth,
  )
  return {
    status: Utils.hexToNumber(txReceipt.status),
  }
}

export async function transaction(_obj, _args, _ctx, _info) {
  return await _ctx.library.getTransaction(_args.txHash)
}

export async function txPrediction(_obj, _args, _ctx, _info) {
  const response = await fetch(
    `https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${_args.gasPrice}&apikey=${process.env.ETHERSCAN_API_KEY}`,
  )
  return await response.json()
}

export async function threeBoxSpace(_obj, _args, _ctx, _info) {
  const Utils = require('web3-utils')
  const { validateLink } = require('3id-blockchain-utils')
  const Box = require('3box')
  const id = _args.id.toLowerCase()

  let useThreeBox = false
  let profile
  let space

  profile = await Box.getProfile(_args.id)
  space = await Box.getSpace(_args.id, 'livepeer')

  if (space.defaultProfile === '3box') {
    useThreeBox = true
  }

  let addressLinks = []
  if (Object.entries(space).length) {
    const conf = await Box.getConfig(id)
    try {
      const links = await Promise.all(
        conf.links.map(link => validateLink(link)),
      )
      addressLinks = links.filter((link: any) => {
        return (
          link &&
          Utils.toChecksumAddress(link.address) != Utils.toChecksumAddress(id)
        )
      })
    } catch (e) {
      console.log(e)
    }
  }

  const { did } = await Box.getVerifiedAccounts(profile)

  return {
    id,
    name: useThreeBox ? profile.name : space.name,
    website: useThreeBox ? profile.website : space.website,
    description: useThreeBox ? profile.description : space.description,
    image: useThreeBox ? profile.image : space.image,
    defaultProfile: space.defaultProfile,
    addressLinks,
    did,
  }
}

export async function block(_obj, _args, _ctx, _info) {
  return await _ctx.livepeer.rpc.getBlock(_args.id)
}
