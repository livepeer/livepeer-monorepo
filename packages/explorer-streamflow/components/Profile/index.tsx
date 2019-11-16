/** @jsx jsx */
import { Styled, jsx } from 'theme-ui'
import QRCode from 'qrcode.react'
import Chip from '../../components/Chip'

export default ({
  account,
  role = 'Orchestrator',
  isConnected = false,
  styles = {},
  variant = 'primary',
  ...props
}) => {
  return (
    <div sx={styles} {...props}>
      <QRCode
        style={{
          borderRadius: 1000,
          width: 70,
          height: 70,
          marginBottom: 3,
        }}
        fgColor={`#${account.substr(2, 6)}`}
        value={account}
      />
      <Styled.h1 sx={{ mb: 2 }}>
        {isConnected
          ? 'My Account'
          : account.replace(account.slice(7, 37), '…')}
      </Styled.h1>
      <Chip label={role} />
    </div>
  )
}
