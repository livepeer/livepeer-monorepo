import React from 'react'

const LockedWalletAlert = () => {
  return (
    <div
      style={{
          textAlign: "center",
          backgroundColor: "#ea002a",
          fontSize:"13px",
          padding: "2px",
      }}>
      <p style={{margin: "0", color: "white"}}>
        Web3 locked. Please unlock&nbsp;
        <a href="https://metamask.io/?utm_source=livepeer.org&utm_medium=referral"
          style={{color: "inherit"}}
        >
          Metamask
        </a>
      </p>
    </div>
  )
}

export default LockedWalletAlert
