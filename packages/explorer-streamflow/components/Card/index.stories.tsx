/** @jsx jsx */
import { jsx, Box, Styled } from 'theme-ui'
import { storiesOf } from '@storybook/react'
import Card from './index'

storiesOf('Card', module).add('default', () => (
  <Card
    sx={{ minWidth: 600 }}
    title="Token Holder Stake"
    subtitle={
      <div sx={{ fontSize: 5, color: 'text', fontFamily: 'monospace' }}>
        612.00<span sx={{ ml: 1, fontSize: 1 }}>LPT</span>
      </div>
    }
  >
    hi
  </Card>
))
