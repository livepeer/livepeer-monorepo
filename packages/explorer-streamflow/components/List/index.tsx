/** @jsx jsx */
import { jsx } from 'theme-ui'

export default ({ header = null, children, ...props }) => (
  <div sx={{ width: '100%' }} {...props}>
    <div sx={{ mb: 2 }}>{header}</div>
    {children}
  </div>
)
