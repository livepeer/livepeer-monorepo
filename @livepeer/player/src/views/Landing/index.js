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

const Container = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding-bottom: 33.33vh;
`

const Landing = ({ query, changeChannel }) => (
  <Container>
    <Navbar />
    <img src="/wordmark.svg" width="240" alt="The glorious Livepeer wordmark" />
    <br />
    <br />
    <br />
    <p>It's easy to view live streams on the Livepeer network</p>
    <button onClick={() => changeChannel(1)}>
      Check out the official Livepeer channel
    </button>
    <p>or</p>
    <p>Find a channel by entering a broadcaster's Ethereum address</p>
    <div>
      <input type="search" placeholder="address" />
      <button>search</button>
    </div>
    <Footer />
  </Container>
)

export default enhance(Landing)
