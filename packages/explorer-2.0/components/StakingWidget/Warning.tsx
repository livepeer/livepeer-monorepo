/** @jsx jsx */
import { jsx } from 'theme-ui'

export default ({ children }) => {
  return (
    <div
      sx={{
        pt: 2,
        color: 'muted',
        textAlign: 'center',
        fontSize: 0,
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  )
}
