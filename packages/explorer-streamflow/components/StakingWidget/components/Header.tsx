/** @jsx jsx */
import { Styled, jsx, Flex } from 'theme-ui'
import QRCode from 'qrcode.react'

export default () => {
  return (
    <Styled.h4
      as="h3"
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'border',
        fontWeight: 'bold',
        fontSize: 20,
      }}
    >
      <QRCode
        style={{
          borderRadius: 1000,
          width: 44,
          height: 44,
          marginRight: 16,
        }}
        fgColor={`#${'0x58b6a8a3302369daec383334672404ee733ab239'.substr(
          2,
          6,
        )}`}
        value={'0x58b6a8a3302369daec383334672404ee733ab239'}
      />
      <Flex sx={{ flexDirection: 'column' }}>
        <Styled.h3>Staked</Styled.h3>
        <div
          sx={{
            fontWeight: 'normal',
            color: 'muted',
            fontSize: 1,
            lineHeight: 1.5,
            textTransform: 'initial',
          }}
        >
          0xe9e...28427
        </div>
      </Flex>
    </Styled.h4>
  )
}
