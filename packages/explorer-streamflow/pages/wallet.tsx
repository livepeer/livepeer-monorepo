/** @jsx jsx */
import { useState } from 'react'
import { jsx } from 'theme-ui'
import Layout from '../components/Layout'
import { useWeb3Context, Web3Consumer } from 'web3-react'
import connectors from '../lib/connectors'
import { ethers } from 'ethers'

export default () => {
  const context = useWeb3Context()

  console.log(context)

  if (context.error) {
    console.error('Error!')
  }

  const [transactionHash, setTransactionHash] = useState()

  function sendTransaction() {
    const signer = context.library.getSigner()

    signer
      .sendTransaction({
        to: ethers.constants.AddressZero,
        value: ethers.utils.bigNumberify('0')
      })
      .then(({ hash }) => {
        setTransactionHash(hash)
      })
  }

  return (
    <Layout>
      <h1>web3-react Demo</h1>
      <h3>(latest)</h3>

      <Web3ConsumerComponent />

      {context.error && (
        <p>An error occurred, check the console for details.</p>
      )}

      {Object.keys(connectors).map(connectorName => (
        <button
          key={connectorName}
          disabled={context.connectorName === connectorName}
          onClick={() => context.setConnector(connectorName)}>
          Activate {connectorName}
        </button>
      ))}

      <br />
      <br />

      {(context.active || (context.error && context.connectorName)) && (
        <button onClick={() => context.unsetConnector()}>
          {context.active ? 'Deactivate Connector' : 'Reset'}
        </button>
      )}

      {context.active && context.account && !transactionHash && (
        <button onClick={sendTransaction}>Send Dummy Transaction</button>
      )}

      {transactionHash && <p>{transactionHash}</p>}
    </Layout>
  )
}

function Web3ConsumerComponent() {
  return (
    <Web3Consumer>
      {context => {
        const { active, connectorName, account, networkId } = context
        return (
          active && (
            <>
              <p>Active Connector: {connectorName}</p>
              <p>Account: {account || 'None'}</p>
              <p>Network ID: {networkId}</p>
            </>
          )
        )
      }}
    </Web3Consumer>
  )
}
