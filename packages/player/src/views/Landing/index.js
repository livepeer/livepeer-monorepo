import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {
  actions as routingActions,
  selectors as routingSelectors,
} from '../../services/routing'

const { changeChannel } = routingActions
const { getParsedQueryString } = routingSelectors

const mapStateToProps = state => ({
  query: getParsedQueryString(state),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ changeChannel }, dispatch)

const enhance = connect(mapStateToProps, mapDispatchToProps)

const Landing = ({ query, changeChannel }) => (
  <Container>
    <Navbar />
    <img src="/wordmark.svg" width="240" alt="The glorious Livepeer wordmark" />
    <br />
    <br />
    <p>Find a channel by entering a broadcaster's ETH address</p>
    <div style={{ maxWidth: '100%', width: 480 }}>
      <SearchBar
        id="broadcaster"
        type="search"
        placeholder="example: 0x86a1405f3aede8e904dbd584971ff685e80418cc"
        onKeyDown={e => {
          if (e.keyCode !== 13 || !e.target.value) return
          document.getElementById('broadcaster-search-button').click()
        }}
      />
      <br />
      <br />
      <div style={{ textAlign: 'right' }}>
        <SearchButton
          id="broadcaster-search-button"
          onClick={() => {
            const { value } = document.getElementById('broadcaster')
            if (!value) return
            changeChannel(value)
          }}
        >
          search
        </SearchButton>
      </div>
    </div>
    <Footer />
  </Container>
)

const Container = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0 32px;
  padding-bottom: 33.33vh;
  background: #03a678;
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

export default enhance(Landing)
