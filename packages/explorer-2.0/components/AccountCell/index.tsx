import { Flex } from 'theme-ui'
import QRCode from 'qrcode.react'
import { textTruncate, getDelegationStatusColor } from '../../lib/utils'

const ActiveCircle = ({ status }, props) => {
  return (
    <div
      className="status"
      sx={{
        position: 'absolute',
        right: '-2px',
        bottom: '-2px',
        bg: getDelegationStatusColor(status),
        border: '3px solid',
        borderColor: 'background',
        boxSizing: 'border-box',
        width: 14,
        height: 14,
        borderRadius: 1000,
        ...props.sx,
      }}
    />
  )
}

export default ({ status, threeBoxSpace, active, address }) => {
  return (
    <Flex sx={{ alignItems: 'center' }}>
      <Flex sx={{ minWidth: 40, minHeight: 40, position: 'relative', mr: 2 }}>
        {process.env.THREEBOX_ENABLED && threeBoxSpace.image ? (
          <img
            sx={{
              objectFit: 'cover',
              borderRadius: 1000,
              width: 40,
              height: 40,
            }}
            src={`https://ipfs.infura.io/ipfs/${threeBoxSpace.image}`}
          />
        ) : (
          <QRCode
            style={{
              borderRadius: 1000,
              width: 40,
              height: 40,
            }}
            fgColor={`#${address.substr(2, 6)}`}
            value={address}
          />
        )}
        <ActiveCircle status={status} />
      </Flex>

      <Flex
        sx={{
          mr: 2,
          color: 'text',
          transition: 'all .3s',
          borderBottom: '1px solid',
          borderColor: 'transparent',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Flex
          className="orchestratorLink"
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div sx={{ fontWeight: 600 }}>
            {process.env.THREEBOX_ENABLED && threeBoxSpace.name
              ? textTruncate(threeBoxSpace.name, 17, '…')
              : address.replace(address.slice(5, 39), '…')}
          </div>
        </Flex>

        {active && (
          <div
            sx={{
              display: 'inline-flex',
              padding: '3px 6px',
              border: '1px solid',
              borderColor: 'border',
              color: 'muted',
              fontWeight: 600,
              alignSelf: 'center',
              borderRadius: 3,
              fontSize: '10px',
              alignItems: 'center',
            }}
          >
            ACTIVE
          </div>
        )}
      </Flex>
    </Flex>
  )
}
