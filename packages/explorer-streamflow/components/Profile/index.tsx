/** @jsx jsx */
import { Styled, jsx } from 'theme-ui'
import QRCode from 'qrcode.react'
import Chip from '../../components/Chip'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const IS_ORCHESTRATOR = gql`
  query transcoder($id: ID!) {
    transcoder(id: $id) {
      id
    }
  }
`

export default ({
  account,
  isConnectedAccount = false,
  styles = {},
  variant = 'primary',
  ...props
}) => {
  const { data } = useQuery(IS_ORCHESTRATOR, {
    variables: { id: account },
  })
  const isOrchestrator = data.transcoder

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
        {isConnectedAccount
          ? 'My Account'
          : account.replace(account.slice(7, 37), '…')}
      </Styled.h1>
      <Chip label={isOrchestrator ? 'Orchestrator' : 'Tokenholder'} />
    </div>
  )
}
