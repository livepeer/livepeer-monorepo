/** @jsx jsx */
import { jsx, Styled, Flex } from 'theme-ui'
import React from 'react'
import ArrowRight from '../../static/img/arrow-right-long.svg'

export default () => {
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
        <span sx={{ fontFamily: 'monospace', fontSize: 4 }}>100</span>{' '}
        <span sx={{ fontSize: 1 }}>LPT</span>
      </div>
      <ArrowRight sx={{ mx: 4, color: 'primary' }} />
      <Styled.h3>Livepeer Community Node</Styled.h3>
    </Flex>
  )
}
