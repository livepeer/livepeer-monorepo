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

const { changeURL } = routingActions
const { getParsedQueryString } = routingSelectors

const mapStateToProps = state => ({
  query: getParsedQueryString(state),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ changeURL }, dispatch)

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
)

const Landing = ({ query, changeURL }) => {
  let searchBarRef
  return (
    <Container>
      <Navbar />
      <img src="/wordmark.svg" width="240" alt="Livepeer logo" />
      <h3 style={{ letterSpacing: 8 }}>Media Player</h3>
      <br />
      <br />
      <p>Enter the URL of a video stream</p>
      <SearchForm
        onSubmit={e => {
          e.preventDefault()
          if (!searchBarRef || !searchBarRef.value) {
            return
          }
          changeURL(searchBarRef.value)
        }}
      >
        <SearchBar
          id="broadcaster"
          type="search"
          placeholder="example: http://example.com/stream.m3u8"
          innerRef={ref => (searchBarRef = ref)}
        />
        <br />
        <br />
        <div style={{ textAlign: 'right' }}>
          <SearchButton>search</SearchButton>
        </div>
      </SearchForm>
      <Footer />
    </Container>
  )
}

const SearchForm = styled.form`
  display: block;
  max-width: 100%;
  width: 480px;
`

const Container = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0 32px;
  padding-bottom: 33.33vh;
  background: #000;
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
