/** @jsx jsx */
import { jsx } from 'theme-ui'

export default () => {
  return (
    <div
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        borderBottom: '1px solid',
        borderColor: 'border',
        mb: 2,
      }}
    >
      <div
        sx={{
          width: '50%',
          textAlign: 'center',
          color: 'muted',
          pb: '10px',
          fontSize: 1,
          fontWeight: 500,
          borderBottom: '2px solid',
          borderColor: 'primary',
        }}
      >
        Stake
      </div>
      <div
        sx={{
          width: '50%',
          textAlign: 'center',
          color: 'muted',
          pb: '10px',
          fontSize: 1,
          fontWeight: 500,
          borderBottom: '1px solid',
          borderColor: 'transparent',
        }}
      >
        Unstake
      </div>
    </div>
  )
}
