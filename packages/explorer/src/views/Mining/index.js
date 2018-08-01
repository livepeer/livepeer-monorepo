import * as React from 'react'
import { BasicNavbar, ScrollToTopOnMount } from '../../components'
import enhance from './enhance'
import { instructions, Instruction } from './instructions'
import TokenMiner from './tokenMiner'

// Get external css file
import './style.css'

type MiningViewProps = {
  generateToken: ({ address: string, proof: string }) => Promise<*>,
}

const MiningView: React.ComponentType<MiningViewProps> = ({
  coinbase,
  generateToken,
  history,
}) => {
  var balance
  const { loading } = coinbase
  // You can hard-code a valid address for testing purpose
  // const defaultAddress = '0x4fe9367ef5dad459ae9cc4265c69b1b10a4e1288'
  const defaultAddress = coinbase.data.coinbase
  const contentLength = 51961420

  // Renders error when it occurs
  const renderError = err =>
    typeof err !== 'string' ? (
      err
    ) : (
      <p>
        {`Sorry, mining is unavailable at this time. Please try again later. ${err}`}
      </p>
    )
  // Generates instructions and store it in a constant
  const instruction = instructions().map((item, index) => {
    return <Instruction key={index} item={item} />
  })
  // Store instructions for header and footer
  const instruction_header = 'How to earn livepeer tokens'
  const instruction_footer = `You can repeat this process as many times as you like and increase your number of tokens.`

  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <BasicNavbar />
      <div className="main">
        <div className="main-instruct">
          <h1>{instruction_header}</h1>
          {instruction}
          <p>{instruction_footer}</p>
          <br />
          <h2>Hardware / Software Requirements:</h2>
          <ul>
            <li>Operating System Windows or Mac</li>
            <li>Access to the internet</li>
            <li>Web 3 wallet MetaMask</li>
          </ul>
        </div>
        <div className="token-area">
          {loading && (
            <div className="mining-area">
              <p>Loading...</p>
            </div>
          )}
          <div className="mining-area">
            {defaultAddress.length === 0 ? (
              <React.Fragment>
                <div className="mining-area">
                  <h2 className="instruct-heading">Mine livepeer token</h2>
                  <p>
                    In order to mine, you will need to log into your ETH account
                    using the metamask plugin. If you are not sure how to do
                    this, please read our guide:
                  </p>
                  <h3 style={{ margin: '30px' }}>
                    <a
                      href="https://forum.livepeer.org/t/how-to-install-metamask-on-chrome-browser-to-enable-web-3-0/272"
                      target="_blank"
                    >
                      How to Install MetaMask &rarr;
                    </a>
                  </h3>
                </div>
              </React.Fragment>
            ) : (
              <TokenMiner
                allowManualEntry={false}
                contentLength={contentLength}
                defaultAddress={defaultAddress}
                renderError={renderError}
                input="QmQbvkaw5j8TFeeR7c5Cs2naDciUVq9cLWnV3iNEzE784r"
                history={history}
                onDone={e => {
                  e.preventDefault()
                  history.push(`/me?tour=true`)
                }}
                worker="QmU3aMRGAHahFoP8aC2jHiMb3DcqZ43myLx3ZPN4dfYYXZ"
              />
            )}
            {/**
             * This is the old worker hash on IPFS
             * worker="QmbiSa3PSXwRw6aoCRUcEDB4F2c9jvz2UMZJJbyetPA9aY"
             **/}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default enhance(MiningView)
