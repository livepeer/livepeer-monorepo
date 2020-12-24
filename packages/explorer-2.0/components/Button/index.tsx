import { Styled } from 'theme-ui'

interface Props {
  as?: any
  variant?: string
  size?: string
  [x: string]: any
}

const Index = ({
  as = 'button',
  variant = 'primary',
  size = 'normal',
  ...props
}: Props) => (
  <Styled.div
    as={as}
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
      px: 3,
      py: 1,
      border: 0,
      borderRadius: 6,
      opacity: props.disabled ? 0.15 : 1,
      variant: `buttons.${variant}`,
      position: 'relative',
    }}
  />
)

export default Index
