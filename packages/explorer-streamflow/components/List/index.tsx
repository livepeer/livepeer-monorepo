/** @jsx jsx */
import { jsx } from 'theme-ui'

export default ({ header, children, ...props }) => (
  <div {...props}>{children}</div>
)
