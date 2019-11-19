/** @jsx jsx */
import { Styled, jsx, Flex } from 'theme-ui'
import QRCode from 'qrcode.react'

export default ({ transcoder }) => {
  return (
    <Styled.h4
      as="h3"
      sx={{
        pt: 2,
        pb: 1,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
      }}
    >
      <Flex sx={{ minWidth: 32, minHeight: 32, position: 'relative', mr: 2 }}>
        <QRCode
          style={{
            borderRadius: 1000,
            width: 40,
            height: 40,
          }}
          fgColor={`#${transcoder.id.substr(2, 6)}`}
          value={transcoder.id}
        />
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        <Styled.h4 sx={{ fontSize: 20 }}>
          {transcoder.id.replace(transcoder.id.slice(7, 37), '…')}
        </Styled.h4>
        <div
          sx={{
            fontWeight: 'normal',
            color: 'muted',
            fontSize: 1,
            lineHeight: 1.5,
            textTransform: 'initial',
          }}
        ></div>
      </Flex>
    </Styled.h4>
  )
}
