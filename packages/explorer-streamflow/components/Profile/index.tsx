/** @jsx jsx */
import { Styled, jsx } from 'theme-ui'
import QRCode from 'qrcode.react'
import Chip from '../../components/Chip'

export default ({
  account,
  role = 'Orchestrator',
  transcoder,
  isConnected = false,
  styles = {},
  variant = 'primary',
  ...props
}) => {
  return (
    <div sx={styles} {...props}>
      <div
        sx={{
          mb: 2,
          width: 70,
          height: 70,
          position: 'relative',
        }}
      >
        <QRCode
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 1000,
          }}
          fgColor={`#${account.substr(2, 6)}`}
          value={account}
        />

        {role == 'Orchestrator' && transcoder.active && (
          <div
            sx={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              backgroundColor: 'primary',
              border: '4px solid #131418',
              boxSizing: 'border-box',
              width: 18,
              height: 18,
              borderRadius: 1000,
            }}
          ></div>
        )}
      </div>
      <Styled.h1 sx={{ mb: 2 }}>
        {isConnected
          ? 'My Account'
          : account.replace(account.slice(7, 37), '…')}
      </Styled.h1>
      <Chip label={role} />
    </div>
  )
}
