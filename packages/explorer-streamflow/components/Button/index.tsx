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
      fontSize: '14px',
      fontWeight: '700',
      textTransform: 'uppercase',
      m: 0,
      px: 2,
      py: 1,
      border: 0,
      borderRadius: 4,
      variant: `buttons.${variant}`,
    }}
  />
)
