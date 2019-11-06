/** @jsx jsx */
import { Styled, jsx } from 'theme-ui'

export default ({ variant = 'primary', size = 'normal', ...props }) => (
  <Styled.div
    {...props}
    sx={{
      appearance: 'none',
      display: 'inline-block',
      textAlign: 'center',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      lineHeight: '22px',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '700',
      textTransform: 'uppercase',
      m: 0,
      px: 2,
      py: 1,
      border: 0,
      borderRadius: 4,
      opacity: props.disabled ? 0.15 : 1,
      variant: `buttons.${variant}`,
      position: 'relative',
    }}
  />
)
