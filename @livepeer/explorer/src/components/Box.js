import React from 'react'
import styled from 'styled-components'

const Box = ({ children, width }) => {
  return (
    <OuterBox width={width}>
      <InnerBox>{children}</InnerBox>
    </OuterBox>
  )
}

const OuterBox = styled.div`
  width: ${({ width }) => width || '100%'};
  padding: 16px 8px;
  text-align: center;
`

const InnerBox = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 2px 0px rgba(0, 0, 0, 0.15);
`

export default Box
