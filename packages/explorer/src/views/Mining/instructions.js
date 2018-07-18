let instructions = function() {
  let data = {
    first: {
      heading: '1. Log in to Web 3 Wallet',
      instruction:
        'You will need a Web3 wallet such as MetaMask with enough Ethereum to pay for the Gas cost of executing the smart contracts that generate LPT tokens',
    },
    second: {
      heading: '2. Set Mining Parameters',
      instruction:
        'Selct your gas price. If your gas price is too low, the transaction might take longer or miners might not process your transaction.',
    },
    third: {
      heading: '3. Earn LPT tokens',
      instruction: `The Livepeer Mining smart contract will generate 2.4 LPT in each of the eligible Ethereum addresses. A portion of LPT generated will be allocated to you for claiming the address. <br>
                          Each round of mining generates tokens for 20 eligible Ethereum addresses. <br>
                          You do not need to provide the eligible ethereum addresses. Livepeer provides and submits the eligible Ethereum addresses for you.`,
    },
  }
  return data
}

export default instructions
