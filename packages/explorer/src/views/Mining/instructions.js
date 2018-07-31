import { Image } from './image'
import * as React from 'react'
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
      altText: 'Image 1',
    },
    {
      heading: 'Set mining parameters',
      instruction: [
        'Select your gas price. If your gas price is too low, the transaction might take longer or miners might not process your transaction.',
      ],
      imgSrc: 'static/images/Step-2-Livepeer.png',
      altText: 'Image 1',
    },
    {
      heading: 'Earn lpt tokens',
      instruction: [
        'The Livepeer Mining smart contract will generate 2.4 LPT in each of the eligible Ethereum addresses. A portion of LPT generated will be allocated to you for claiming the address.',
        'Each round of mining generates tokens for 20 eligible Ethereum addresses.',
        'You do not need to provide the eligible ethereum addresses. Livepeer provides and submits the eligible Ethereum addresses for you.',
      ],
      imgSrc: 'static/images/Step-3-Livepeer.png',
      altText: 'Image 1',
    },
  ]
  return data
}

class Instruction extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="chip">
        {/**
         * Only display an image if it's src has been declared
         */}
        {this.props.item.imgSrc && (
          <Image
            imgSrc={this.props.item.imgSrc}
            altText={this.props.item.altText}
          />
        )}

        <h2>{this.props.item.heading}</h2>
        {/**
         * All loops should have a key on its element.
         * Note: index is only used because these will be
         * static (unchanging) elements. If elements becomes
         * dynamic in the future please find a better alternative
         */}
        {this.props.item.instruction.map((item, index) => {
          return <p key={index}>{item}</p>
        })}
      </div>
    )
  }
}

export { instructions, Instruction }
