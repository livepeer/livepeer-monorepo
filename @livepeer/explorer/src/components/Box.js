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
  // width: ${({ width }) => width || '100%'};
  padding: 0 8px 16px 8px;
  text-align: center;
  flex: ${({ width }) => width || '100%'};;
  flex-direction: row;
  display: inline-flex;
`

const InnerBox = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 2px 0px rgba(0, 0, 0, 0.15);
`

export default Box
