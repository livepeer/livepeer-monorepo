/** @jsx jsx */
import { jsx } from 'theme-ui'

export default ({ header = null, children, ...props }) => (
  <div {...props}>
    {header}
    {children}
  </div>
)
