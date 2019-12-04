/** @jsx jsx */
import { jsx, Flex, Styled } from 'theme-ui'
import * as Utils from 'web3-utils'
import { abbreviateNumber } from '../../lib/utils'
import { useWeb3Context } from 'web3-react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Spinner from '../../components/Spinner'
import Card from '../../components/Card'
import Link from 'next/link'
import StakeTransactions from '../StakeTransactions'
import DelegateCard from '../DelegateCard'

const GET_DATA = gql`
  query($account: ID!) {
    delegator(id: $account) {
      id
      pendingStake
      bondedAmount
      principal
      unbonded
      delegate {
        id
        totalStake
      }
      unbondingLocks {
        id
        amount
        unbondingLockId
        withdrawRound
        delegate {
          id
        }
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

export default () => {
  const router = useRouter()
  const query = router.query
  const account = query.account as string
  const context = useWeb3Context()
  const isMyAccount = account == context.account

  const { data, loading, error } = useQuery(GET_DATA, {
    variables: {
      account: account.toLowerCase(),
    },
    ssr: false,
    //pollInterval: 10000,
  })

  if (error) {
    console.error(error)
  }

  if (loading) {
    return (
      <Flex
        sx={{
          pt: 4,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spinner />
      </Flex>
    )
  }

  if (!(data && data.delegator && data.delegator.bondedAmount != null)) {
    if (isMyAccount) {
      return (
        <div sx={{ pt: 4 }}>
          <span sx={{ mr: 2 }}>Time to get staking!</span>
          <Link href="/" passHref>
            <Styled.a>View Orchestrators.</Styled.a>
          </Link>
        </div>
      )
    }
    return (
      <div sx={{ pt: 4 }}>
        <span sx={{ mr: 2 }}>Nothing here.</span>
      </div>
    )
  }

  const pendingStake = Math.max(
    Utils.fromWei(data.delegator.bondedAmount),
    Utils.fromWei(data.delegator.pendingStake),
  )

  const unbonded = data.delegator.unbonded
    ? Utils.fromWei(data.delegator.unbonded)
    : 0
  const principal = Utils.fromWei(data.delegator.principal)

  const rewards =
    pendingStake + parseFloat(unbonded ? unbonded : 0) - parseFloat(principal)
  const totalBondedToken = Utils.fromWei(data.protocol.totalBondedToken)

  return (
    <div sx={{ pt: 4 }}>
      {data.delegator.delegate && (
        <DelegateCard delegate={data.delegator.delegate} />
      )}
      <div
        sx={{
          display: 'grid',
          gridGap: 2,
          gridTemplateColumns: `repeat(auto-fit, minmax(128px, 1fr))`,
          mb: 5,
        }}
      >
        <Card
          sx={{ flex: 1, mb: 2 }}
          title="Total Staked"
          subtitle={
            <div
              sx={{
                fontSize: 5,
                color: 'text',
                lineHeight: 'heading',
                fontFamily: 'monospace',
              }}
            >
              {abbreviateNumber(pendingStake, 5)}
              <span sx={{ ml: 1, fontSize: 1 }}>LPT</span>
            </div>
          }
        >
          <div sx={{ mt: 3 }}>
            <Flex sx={{ fontSize: 1, mb: 1, justifyContent: 'space-between' }}>
              <span sx={{ color: 'muted' }}>Principal</span>
              <span>
                <span sx={{ fontFamily: 'monospace' }}>
                  {abbreviateNumber(principal, 3)}
                </span>
              </span>
            </Flex>
            <Flex
              sx={{
                fontSize: 1,
                mb: 1,
                justifyContent: 'space-between',
              }}
            >
              <span sx={{ color: 'muted' }}>Unstaked</span>
              <span>
                <span sx={{ fontFamily: 'monospace' }}>
                  {unbonded > 0 ? (
                    <span sx={{ color: 'red' }}>
                      -{abbreviateNumber(unbonded, 3)}
                    </span>
                  ) : (
                    0
                  )}
                </span>
              </span>
            </Flex>
            <Flex sx={{ fontSize: 1, justifyContent: 'space-between' }}>
              <span sx={{ color: 'muted' }}>Rewards</span>
              <span>
                <span sx={{ color: 'primary', fontFamily: 'monospace' }}>
                  +{abbreviateNumber(rewards, 6)}
                </span>
              </span>
            </Flex>
          </div>
        </Card>
        {data.delegator.delegate && (
          <Card
            sx={{ flex: 1, mb: 2 }}
            title="Stake Equity"
            subtitle={
              <div
                sx={{
                  fontSize: 5,
                  color: 'text',
                  lineHeight: 'heading',
                  fontFamily: 'monospace',
                }}
              >
                {((pendingStake / totalBondedToken) * 100).toPrecision(4)}%
              </div>
            }
          >
            <div sx={{ mt: 3 }}>
              <Flex
                sx={{
                  fontSize: 1,
                  mb: 1,
                  justifyContent: 'space-between',
                }}
              >
                <span sx={{ color: 'muted' }}>
                  Account{' '}
                  <span sx={{ color: 'text' }}>
                    ({((pendingStake / totalBondedToken) * 100).toPrecision(4)}
                    %)
                  </span>
                </span>
                <span>
                  <span sx={{ fontFamily: 'monospace' }}>
                    {abbreviateNumber(pendingStake, 3)}
                  </span>
                </span>
              </Flex>
              <Flex
                sx={{ fontSize: 1, mb: 1, justifyContent: 'space-between' }}
              >
                <span sx={{ color: 'muted' }}>
                  Orchestrator{' '}
                  <span sx={{ color: 'text' }}>
                    (
                    {(
                      (Utils.fromWei(data.delegator.delegate.totalStake) /
                        totalBondedToken) *
                      100
                    ).toPrecision(4)}
                    %)
                  </span>
                </span>
                <span>
                  <span sx={{ fontFamily: 'monospace' }}>
                    {abbreviateNumber(
                      Utils.fromWei(data.delegator.delegate.totalStake),
                      3,
                    )}
                  </span>
                </span>
              </Flex>

              <Flex
                sx={{
                  fontSize: 1,
                  justifyContent: 'space-between',
                }}
              >
                <span sx={{ color: 'muted' }}>
                  Rest of Network{' '}
                  <span sx={{ color: 'text' }}>
                    (
                    {(
                      ((totalBondedToken -
                        Utils.fromWei(data.delegator.delegate.totalStake) -
                        pendingStake) /
                        totalBondedToken) *
                      100
                    ).toPrecision(4)}
                    %)
                  </span>
                </span>
                <span>
                  <span sx={{ fontFamily: 'monospace' }}>
                    {abbreviateNumber(
                      totalBondedToken -
                        Utils.fromWei(data.delegator.delegate.totalStake) -
                        pendingStake,
                      3,
                    )}
                  </span>
                </span>
              </Flex>
            </div>
          </Card>
        )}
      </div>
      <StakeTransactions
        delegator={data.delegator}
        currentRound={data.currentRound[0]}
        isMyAccount={isMyAccount}
      />
    </div>
  )
}
