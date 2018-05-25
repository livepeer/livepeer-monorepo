import React from 'react'
import styled from 'styled-components'
import { BasicNavbar, Footer, ScrollToTopOnMount } from '../../components'

const NETWORKS = {
  1: 'Ethereum Main Network',
  2: 'Morden, Expanse Mainnet',
  3: 'Ropsten Test Network',
  4: 'Rinkeby Test Network',
  30: 'Rootstock Main Network',
  31: 'Rootstock Test Network',
  42: 'Kovan Test Network',
  61: 'Ethereum Classic Main Network',
  62: 'Ethereum Classic Test Network',
  858585: 'Livepeer Test Network',
}
const getNetwork = web3 => {
  return web3 && web3.version
    ? NETWORKS[web3.version.network] || 'Unknown'
    : NETWORKS['858585']
}

const Landing = ({ viewAccount, ...props }) => (
  <Container>
    <ScrollToTopOnMount />
    <BasicNavbar />
    <img
      src={`${process.env.PUBLIC_URL}/wordmark.svg`}
      width="240"
      alt="The glorious Livepeer wordmark"
    />
    <h3 style={{ letterSpacing: 8 }}>Protocol Explorer</h3>
    <br />
    <br />
    <p>View a Livepeer account by entering an ETH address</p>
    <div style={{ maxWidth: '100%', width: 480 }}>
      <SearchBar
        id="account"
        type="search"
        placeholder="example: 0x86a1405f3aede8e904dbd584971ff685e80418cc"
        onKeyDown={e => {
          if (e.keyCode !== 13 || !e.target.value) return
          document.getElementById('account-search-button').click()
        }}
      />
      <br />
      <br />
      <div style={{ textAlign: 'right' }}>
        <SearchButton
          id="account-search-button"
          onClick={() => {
            const { value } = document.getElementById('account')
            if (!value) return
            viewAccount(value)
          }}
        >
          search
        </SearchButton>
      </div>
      <br />
      <br />
      <div style={{ borderRadius: 8, border: '1px solid #fff', padding: 32 }}>
        <h2 style={{ textDecoration: 'underline' }}>Current Network</h2>
        <div>
          <p>{getNetwork(window.web3)}</p>
        </div>
        <h2 style={{ textDecoration: 'underline' }}>ABI Contract Addresses</h2>
        {Object.entries(window.livepeer.config.contracts).map(
          ([name, { address }]) => (
            <div key={name}>
              <p>{name}</p>
              <p>
                <code>{address}</code>
              </p>
            </div>
          ),
        )}
      </div>
    </div>
    <Footer />
  </Container>
)

const Container = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: top;
  min-height: 100vh;
  padding: 80px 32px;
  background: radial-gradient(at 200% 200%, rgba(0, 235, 136, 0.5), #000 75%);
  color: #fff;
`

const SearchBar = styled.input`
  width: 100%;
  height: 48px;
  margin: 0;
  padding: 16px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  outline: 0;
  -webkit-appearance: textfield;
`

const SearchButton = styled.button`
  display: inline-block;
  color: #fff;
  padding: 8px 24px;
  border-radius: 4px;
  background: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 0 0 1px inset;
  background: none;
  outline: 0;
  border: none;
  cursor: pointer;
`

export default Landing
