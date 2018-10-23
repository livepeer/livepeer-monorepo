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

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
)

const Landing = ({ query, changeChannel }) => (
  <Container>
    <Navbar />
    {/* <img src="/wordmark.svg" width="240" alt="The glorious Livepeer wordmark" /> */}
    <h3 style={{ letterSpacing: 8 }}>Devcon4.tv</h3>
    <br />
    <br />
    <p>{`Pick a channel`}</p>
    <div style={{ maxWidth: '100%', width: 480 }}>
      <br />
      <br />
      <div style={{ textAlign: 'center' }}>
        <SearchButton
          id="broadcaster-search-button"
          onClick={() => {
            changeChannel('0x1c644f23C3389679D1663F3D237df215014D2c41')
            // const { value } = document.getElementById('broadcaster')
            // if (!value) return
            // changeChannel(value)
          }}
        >
          Channel 1
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
  background: #11457e;
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
