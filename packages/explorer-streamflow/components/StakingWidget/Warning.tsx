/** @jsx jsx */
import { jsx } from 'theme-ui'

export default ({ children }) => {
  return (
    <div
      sx={{
        px: 2,
        pt: 2,
        color: 'muted',
        textAlign: 'center',
        fontSize: 0,
      }}
    >
      {children}
    </div>
  )
}
