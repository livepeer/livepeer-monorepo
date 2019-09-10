/** @jsx jsx */
import { jsx, Styled, Flex } from 'theme-ui'
import React from 'react'
import ArrowRight from '../../static/img/arrow-right-long.svg'

export default ({ action = 'stake', amount = 0, orchestrator = {} }) => {
  return (
    <Flex
      sx={{
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 2,
        p: 3,
        alignItems: 'center',
        justifyContent: 'center',
        mb: 4,
      }}
    >
      <div>
        <span sx={{ fontFamily: 'monospace', fontSize: 4 }}>{amount}</span>{' '}
        <span sx={{ fontSize: 1 }}>LPT</span>
      </div>
      <ArrowRight
        sx={{
          mx: 4,
          transform: `rotate(${action == 'stake' ? '0' : '180deg'})`,
          color: action == 'stake' ? 'primary' : 'red',
        }}
      />
      <Styled.h3>0xe9e28...b5ecf59</Styled.h3>
    </Flex>
  )
}
