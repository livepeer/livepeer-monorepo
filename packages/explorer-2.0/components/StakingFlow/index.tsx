/** @jsx jsx */
import { jsx, Styled, Flex } from 'theme-ui'
import React from 'react'
import ArrowRight from '../../public/img/arrow-right-long.svg'

export default ({ action = 'stake', amount = 0, account }) => {
  return (
    <Flex
      sx={{
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 6,
        p: 3,
        alignItems: 'center',
        justifyContent: 'center',
        my: 5,
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
      <Styled.h3>{account.replace(account.slice(7, 37), '…')}</Styled.h3>
    </Flex>
  )
}
