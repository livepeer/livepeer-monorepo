/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import QRCode from 'qrcode.react'
import Link from 'next/link'
import { getDelegationStatusColor } from '../../lib/utils'

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
            sx={{ borderRadius: 1000, width: 40, height: 40 }}
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
      <Flex sx={{ justifyContent: 'space-between', width: '100%' }}>
        <Link
          href="/accounts/[account]/[slug]"
          as={`/accounts/${address}/campaign`}
          passHref
        >
          <a
            className="orchestratorLink"
            sx={{
              mr: 1,
              color: 'text',
              cursor: 'pointer',
              transition: 'all .3s',
              borderBottom: '1px solid',
              borderColor: 'transparent',
            }}
          >
            <Flex
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                {process.env.THREEBOX_ENABLED && threeBoxSpace.name
                  ? threeBoxSpace.name
                  : address.replace(address.slice(5, 39), '…')}
              </div>
            </Flex>
          </a>
        </Link>
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
