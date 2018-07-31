/***
 * Returns data array which stores instructions for
 * mining Livepeer tokens
 */
const instructions = function() {
  let data = [
    {
      heading: 'Log in to web 3 wallet',
      instruction: [
        'You will need a Web3 wallet such as MetaMask with enough Ethereum to pay for the Gas cost of executing the smart contracts that generate LPT tokens.',
      ],
      imgSrc: 'static/images/Step-1-Livepeer.png',
    },
    {
      heading: 'Set mining parameters',
      instruction: [
        'Select your gas price. If your gas price is too low, the transaction might take longer or miners might not process your transaction.',
      ],
      imgSrc: 'static/images/Step-2-Livepeer.png',
    },
    {
      heading: 'Earn lpt tokens',
      instruction: [
        'The Livepeer Mining smart contract will generate 2.4 LPT in each of the eligible Ethereum addresses. A portion of LPT generated will be allocated to you for claiming the address.',
        'Each round of mining generates tokens for 20 eligible Ethereum addresses.',
        'You do not need to provide the eligible ethereum addresses. Livepeer provides and submits the eligible Ethereum addresses for you.',
      ],
      imgSrc: 'static/images/Step-3-Livepeer.png',
    },
  ]
  return data
}

export { instructions }
