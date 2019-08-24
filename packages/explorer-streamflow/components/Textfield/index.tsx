/** @jsx jsx */
import { Styled, jsx } from 'theme-ui'

export default ({ variant = 'primary', ...props }) => (
  <Styled.div
    as="input"
    {...props}
    sx={{
      backgroundColor: 'transparent',
      borderTop: '0',
      borderLeft: '0',
      borderRight: '0',
      borderBottom: '1px solid',
      borderColor: 'muted',
      p: 2,
      color: 'text',
      boxShadow: 'none',
      outline: 'none',
      fontSize: 24,
      fontFamily: 'monospace',
      '&::-webkit-inner-spin-button': {
        WebkitAppearance: 'none'
      },
      '&::-webkit-outer-spin-button': {
        WebkitAppearance: 'none'
      }
    }}
  />
)
