import React, { ReactElement } from 'react'
import { matchPath } from 'react-router'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { queries } from '@livepeer/graphql-sdk'
import styled, { keyframes } from 'styled-components'
import {
  DownloadCloud as DownloadCloudIcon,
  Plus as PlusIcon,
  Send as SendIcon,
  Zap as VideoIcon,
} from 'react-feather'
import { formatBalance, pathInfo } from '../../utils'
import {
  Banner,
  BasicNavbar,
  Button,
  Content,
  MetricBox,
  Wrapper,
} from '../../components'
import enhance from './enhance'

type Transcoder = {
  id: string,
}

type Props = {
  transcoders: Array<Transcoder>,
  loading: boolean,
}

const TranscodersView = ({ error, history, loading, transcoders }) => {
  return (
    <React.Fragment>
      <BasicNavbar onSearch={x => history.push(`/accounts/${x}`)} />
      <Banner height="128px">
        <h1 style={{ margin: '0 auto' }}>Transcoders</h1>
      </Banner>
      <Content>
        {transcoders.map(props => <TranscoderCard key={props.id} {...props} />)}
      </Content>
    </React.Fragment>
  )
}

const TranscoderCard = props => {
  return (
    <div
      style={{
        background: '#fff',
        marginBottom: 16,
        borderRadius: 8,
        padding: 16,
        overflow: 'auto'
      }}
    >
      <span style={{ fontSize: 10 }}>{JSON.stringify(props)}</span>
    </div>
  )
}

export default enhance(TranscodersView)
