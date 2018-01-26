import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import BasicNavbar from '../../components/BasicNavbar'
import Content from '../../components/Content'
import { actions as routingActions } from '../../services/routing'

const { viewAccount } = routingActions

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      viewAccount,
    },
    dispatch,
  )

const connectRedux = connect(null, mapDispatchToProps)

const enhance = compose(connectRedux)

const TranscodersView = ({ viewAccount }) => {
  return (
    <React.Fragment>
      <BasicNavbar onSearch={viewAccount} />
      <Content>
        <div>Transcoders List!</div>
        <ul>
          <li>foo</li>
          <li>bar</li>
          <li>baz</li>
          <li>qux</li>
        </ul>
      </Content>
    </React.Fragment>
  )
}

export default enhance(TranscodersView)
