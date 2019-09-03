/** @jsx jsx */
import { jsx } from 'theme-ui'

export default ({ variant = 'primary', ...props }) => (
  <div
    sx={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      mb: 3,
      position: 'relative',
    }}
  >
    <input
      {...props}
      sx={{
        backgroundColor: 'transparent',
        borderTop: '0',
        borderLeft: '0',
        borderRight: '0',
        borderBottom: '1px solid',
        borderColor: 'muted',
        p: 1,
        color: 'text',
        boxShadow: 'none',
        width: '100%',
        outline: 'none',
        fontSize: 26,
        fontFamily: 'monospace',
        '&::-webkit-inner-spin-button': {
          WebkitAppearance: 'none',
        },
        '&::-webkit-outer-spin-button': {
          WebkitAppearance: 'none',
        },
      }}
    />
    <div sx={{ fontWeight: 'bold', right: 0, position: 'absolute' }}>LPT</div>
  </div>
)
