/** @jsx jsx */
import { Styled, jsx } from 'theme-ui'

export default ({ variant = 'primary', ...props }) => (
  <Styled.div
    as="button"
    {...props}
    sx={{
      appearance: 'none',
      display: 'inline-block',
      textAlign: 'center',
      lineHeight: 'inherit',
      textDecoration: 'none',
      fontSize: 'inherit',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      m: 0,
      px: 3,
      py: 2,
      border: 0,
      borderRadius: 5,
      // pass variant prop to sx
      variant: `buttons.${variant}`
    }}
  />
)
