/** @jsx jsx */
import { Styled, jsx, Flex } from 'theme-ui'
import QRCode from 'qrcode.react'

export default ({ transcoder }) => {
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
        fgColor={`#${transcoder.id.substr(2, 6)}`}
        value={transcoder.id}
      />
      <Flex sx={{ flexDirection: 'column' }}>
        <Styled.h3>
          {transcoder.id.replace(transcoder.id.slice(7, 37), '…')}
        </Styled.h3>
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
