/** @jsx jsx */
import React from 'react'
import { jsx, Styled } from 'theme-ui'
import Button from '../Button'

export default ({ goTo, nextStep }) => {
  return (
    <div sx={{ py: 1 }}>
      <Styled.h2 sx={{ mb: 2 }}>Stake</Styled.h2>
      <Styled.p>
        You've made it to the final step! Enter the amount of LPT you'd like to
        stake towards this Orchestrator and hit "Stake".
      </Styled.p>
    </div>
  )
}
