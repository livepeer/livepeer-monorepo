import fetch from 'isomorphic-unfetch'
import LivepeerSDK from '@adamsoffer/livepeer-sdk'
import { validateLink } from '3id-blockchain-utils'
import Box from '3box'
import Utils from 'web3-utils'

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
  const id = _args.id.toLowerCase()
  const space = await Box.getSpace(_args.id, 'livepeer')

  let useThreeBox = false
  let box = {
    name: '',
    website: '',
    description: '',
    image: '',
  }

  if (space.defaultProfile === '3box') {
    box = await Box.getProfile(_args.id)
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
        console.log(link)
        return (
          link &&
          Utils.toChecksumAddress(link.address) != Utils.toChecksumAddress(id)
        )
      })
    } catch (e) {
      console.log(e)
    }
  }

  return {
    id,
    name: useThreeBox ? box.name : space.name,
    url: useThreeBox ? box.website : space.url,
    description: useThreeBox ? box.description : space.description,
    image: useThreeBox ? box.image : space.image,
    defaultProfile: space.defaultProfile,
    addressLinks,
    did: async () => {
      const profile = await Box.getProfile(id)
      const { did } = await Box.getVerifiedAccounts(profile)
      return did
    },
  }
}
