export default async (req, res) => {
  const countdownRaw = await fetch(
    `https://${
      process.env.NETWORK === 'rinkeby' ? 'api-rinkeby' : 'api'
    }.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x58b6a8a3302369daec383334672404ee733ab239&apikey=${
      process.env.ETHERSCAN_API_KEY
    }`,
  )
  const { result: totalTokenSupply } = await countdownRaw.json()
  res.end(totalTokenSupply)
}
