import React from 'react'
import Button from '../Button'
import { enableAccounts } from '../../utils'

const LockedWalletAlert = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        backgroundColor: '#ea002a',
        fontSize: '13px',
        fontVariant: 'all-petite-caps',
        padding: '2px',
      }}
    >
      <p style={{ margin: '0', color: 'white' }}>
        limited or no connectivity to web3.
        {window.limitedWeb3Conn ? limited() : locked()}
      </p>
    </div>
  )
}

const limited = () => {
  return (
    <React.Fragment>
      &nbsp;Connect your wallet to access full features.&nbsp;
      <Button
        onClick={enableAccounts}
        style={{
          backgroundColor: 'transparent',
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.35)',
          color: '#FFF',
          fontSize: '10px',
          padding: '5px 7px',
        }}
      >
        Connect Web3
      </Button>
    </React.Fragment>
  )
}

const locked = () => {
  return (
    <React.Fragment>
      &nbsp;Please unlock&nbsp;
      <a
        href="https://metamask.io/?utm_source=livepeer.org&utm_medium=referral"
        style={{ color: 'inherit' }}
      >
        Metamask
      </a>
      &nbsp;or another web3 enabled wallet.
    </React.Fragment>
  )
}

export default LockedWalletAlert
