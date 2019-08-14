/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'

export const StyledLink = (props: any) => (
  <Styled.a
    sx={{
      color: !props.i ? 'primary' : 'muted',
      lineHeight: 'initial',
      display: 'flex',
      fontSize: 16,
      cursor: 'pointer',
      alignItems: 'center',
      p: 3,
      backgroundColor: 'transparent',
      borderRadius: 1000,
      mb: 1,
      transition: 'background-color .2s, color .2s',
      ':nth-last-of-type': {
        mb: 0
      },
      ':hover': {
        backgroundColor: 'rgba(107, 230, 145, .1)',
        color: 'primary',
        transition: 'background-color .2s, color .2s'
      }
    }}>
    {props.children}
  </Styled.a>
)
