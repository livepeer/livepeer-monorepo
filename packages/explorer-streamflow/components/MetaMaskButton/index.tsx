// MetaMaskButton.js
import React, { useContext } from "react";

import MetaMaskContext from "../../lib/metamask";

export default function MetaMaskButton() {
  const { web3, accounts, error, awaiting, openMetaMask } = useContext(
    MetaMaskContext
  );

  function handleButtonClick() {
    alert(`Web3 (${web3.version}) is enabled`);
  }

  if (error && error.message === "MetaMask not installed") {
    return (
      <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
        Install MetaMask
      </a>
    );
  } else if (error && error.message === "User denied account authorization") {
    return (
      <button type="button" onClick={openMetaMask}>
        Please allow MetaMask to connect.
      </button>
    );
  } else if (error && error.message === "MetaMask is locked") {
    return (
      <button type="button" onClick={openMetaMask}>
        Please allow MetaMask to connect.
      </button>
    );
  } else if (error) {
    return (
      <button type="button" onClick={openMetaMask}>
        UNHANDLED ERROR: {error.message}
      </button>
    );
  } else if (!web3 && awaiting) {
    return (
      <button type="button" onClick={openMetaMask}>
        MetaMask is loading...
      </button>
    );
  } else if (!web3) {
    return (
      <button type="button" onClick={openMetaMask}>
        Please open and allow MetaMask
      </button>
    );
  } else if (accounts.length === 0) {
    console.log(accounts);
    return <button type="button">No Wallet 🦊</button>;
  } else {
    // `web3` and `account` loaded 🎉
    return (
      <button type="button" onClick={handleButtonClick}>
        <code>{accounts[0]}</code> 🦊 (v: {web3.version.api})
      </button>
    );
  }
}
