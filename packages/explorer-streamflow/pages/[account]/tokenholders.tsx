/** @jsx jsx */
import React from 'react'
import { jsx, Flex, Styled } from 'theme-ui'
import { useRouter } from 'next/router'
import AccountLayout from '../../layouts/account'
import PageLayout from '../../layouts/main'
import List from '../../components/List'
import ListItem from '../../components/ListItem'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { withApollo } from '../../lib/apollo'
import CircularProgress from '@material-ui/core/CircularProgress'
import Unlink from '../../static/img/unlink.svg'
import { Transcoder, Delegator, Protocol } from '../../@types'
import { abbreviateNumber } from '../../lib/utils'
import DelegatorList from '../../components/DelegatorList'

const GET_DATA = gql`
  query($account: ID!) {
    delegator(id: $account) {
      id
      pendingStake
      status
      delegate {
        id
      }
      unbondingLocks {
        id
        amount
        withdrawRound
        delegate {
          id
        }
      }
    }
    transcoder(id: $account) {
      id
      rewardCut
      feeShare
      totalStake
      active
      delegators {
        id
      }
    }
    protocol {
      totalTokenSupply
      totalBondedToken
    }
    currentRound: rounds(first: 1, orderBy: timestamp, orderDirection: desc) {
      id
    }
  }
`

export default withApollo(() => {
  const router = useRouter()
  const query = router.query
  const account = query.account as string

  const { data, loading, error } = useQuery(GET_DATA, {
    variables: {
      account: account.toLowerCase(),
      address: account.toLowerCase(),
    },
    notifyOnNetworkStatusChange: true,
    ssr: false,
  })

  if (error) {
    console.error(error)
  }

  if (loading) {
    return (
      <PageLayout>
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div sx={{ color: 'primary' }}>
            <CircularProgress size={24} color="inherit" />
          </div>
        </Flex>
      </PageLayout>
    )
  }

  const transcoder: Transcoder = data.transcoder
  const delegator: Delegator = data.delegator
  const protocol: Protocol = data.protocol

  const LinkIcon = (
    <Flex
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1000,
        color: 'primary',
        bg: 'surface',
        width: 30,
        height: 30,
        mr: 2,
        border: '1px solid',
        borderColor: 'border',
      }}
    >
      <Unlink />
    </Flex>
  )

  return (
    <PageLayout>
      <AccountLayout
        transcoder={transcoder}
        delegator={delegator}
        protocol={protocol}
      >
        {!!transcoder.delegators.length && (
          <DelegatorList delegators={transcoder.delegators} />
          // <List
          //   header={<Styled.h3>Tokenholders Staked</Styled.h3>}
          //   sx={{ mb: 6 }}
          // >
          //   {transcoder.delegators.map(delegator => (
          //     <ListItem key={delegator.id}>
          //       {delegator.id.replace(delegator.id.slice(7, 37), '…')}
          //     </ListItem>
          //   ))}
          // </List>
        )}
      </AccountLayout>
    </PageLayout>
  )
})
