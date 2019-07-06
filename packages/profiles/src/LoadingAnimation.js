import React from 'react'
import styled from 'styled-components'
import LoadingGif from './Ellipsis-3s-200px.gif'

const LoadingAnimation = styled.img`
  margin: 0 auto;
  width: 100px;
`

export default () => {
  return <LoadingAnimation src={LoadingGif} />
}
