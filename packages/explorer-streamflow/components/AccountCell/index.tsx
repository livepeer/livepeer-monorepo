/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
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

export default ({ cell }) => {
  const GET_DELEGATION_STATUS = gql`
    query($account: ID!) {
      delegator(id: $account) {
        id
        status
      }
    }
  `
  const { data } = useQuery(GET_DELEGATION_STATUS, {
    variables: {
      account: cell.value.toLowerCase() as string,
    },
    ssr: false,
  })

  return (
    <Flex sx={{ alignItems: 'center' }}>
      <Flex sx={{ minWidth: 32, minHeight: 32, position: 'relative', mr: 2 }}>
        <QRCode
          style={{
            borderRadius: 1000,
            width: 32,
            height: 32,
          }}
          fgColor={`#${cell.value.substr(2, 6)}`}
          value={cell.value}
        />
        {data && data.delegator && (
          <ActiveCircle status={data.delegator.status} />
        )}
      </Flex>
      <Flex sx={{ justifyContent: 'space-between', width: '100%' }}>
        <Link
          href="/account/[account]/[slug]"
          as={`/account/${cell.value}/campaign`}
          passHref
        >
          <a
            sx={{
              color: 'text',
              cursor: 'pointer',
              transition: 'all .3s',
              borderBottom: '1px solid',
              borderColor: 'transparent',
              '&:hover': {
                color: 'primary',
                borderBottom: '1px solid',
                borderColor: 'primary',
                transition: 'all .3s',
              },
            }}
          >
            <Flex
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>{cell.value.replace(cell.value.slice(5, 39), '…')}</div>
            </Flex>
          </a>
        </Link>
        {cell.row.values.active && (
          <div
            sx={{
              display: 'inline-flex',
              padding: '0px 6px',
              border: '1px solid',
              borderColor: 'border',
              color: 'muted',
              fontWeight: 600,
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
