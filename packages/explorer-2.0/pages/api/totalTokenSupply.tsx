export default async (req, res) => {
  const response = await fetch(
    `https://${
      process.env.NEXT_PUBLIC_NETWORK === "rinkeby" ? "api-rinkeby" : "api"
    }.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x58b6a8a3302369daec383334672404ee733ab239&apikey=${
      process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
    }`
  );
  const { result: totalTokenSupply } = await response.json();
  res.end(totalTokenSupply);
};
