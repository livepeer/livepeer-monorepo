/** @jsx jsx */
import { jsx } from 'theme-ui'
import { tint } from '@theme-ui/color'
import { keyframes } from '@emotion/core'

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

export default () => (
  <div
    sx={{
      border: '3px solid',
      borderColor: 'surface',
      borderRadius: '50%',
      borderTopColor: 'primary',
      width: 26,
      height: 26,
      animation: `${rotate} 1s linear`,
      animationIterationCount: 'infinite',
    }}
  ></div>
)
