/** @jsx jsx */
import { jsx } from 'theme-ui'

export default ({ header = null, children, ...props }) => (
  <div sx={{ width: '100%' }} {...props}>
    <div sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'border' }}>
      {header}
    </div>
    <div>{children}</div>
  </div>
)
