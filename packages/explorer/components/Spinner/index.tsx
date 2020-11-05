import { keyframes } from '@emotion/core'

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

export default ({ speed = '1s', ...props }) => (
  <div
    {...props}
    sx={{
      border: '3px solid',
      borderColor: 'surface',
      borderRadius: '50%',
      borderTopColor: 'primary',
      width: 26,
      height: 26,
      maxWidth: 26,
      maxHeight: 26,
      animation: `${rotate} ${speed} linear`,
      animationIterationCount: 'infinite',
    }}
  ></div>
)
