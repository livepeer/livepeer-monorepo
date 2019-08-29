/** @jsx jsx */
import { Styled, jsx } from 'theme-ui'

export default ({ children, ...props }) => (
  <Styled.div
    {...props}
    sx={{
      border: '1px solid',
      borderRadius: 2,
      borderColor: 'muted',
      px: 1,
      py: '4px',
      fontSize: 12
    }}>
    {children}
  </Styled.div>
)
