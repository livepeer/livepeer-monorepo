/** @jsx jsx */
import { jsx } from 'theme-ui'

export default ({ label, variant = 'primary', ...props }) => (
  <div
    sx={{
      borderRadius: 1000,
      bg: 'grey',
      px: 2,
      py: '4px',
      display: 'inline-flex',
      fontSize: 0,
      fontWeight: 600,
      ...props.sx,
    }}
  >
    {label}
  </div>
)
