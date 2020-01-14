/** @jsx jsx */
import React from 'react'
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
import ReactTooltip from 'react-tooltip'
import Help from '../../public/img/help.svg'

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
        threeBoxSpace {
          name
          website
          image
          description
        }
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
          <span sx={{ mr: 2 }}>
            You haven't staked LPT. Stake LPT with an Orchestrator and begin
            earnings rewards.
          </span>
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
        <Link
          href={`/accounts/[account]/[slug]`}
          as={`/accounts/${data.delegator.delegate.id}/campaign`}
          passHref
        >
          <a>
            <Card
              sx={{
                mb: 2,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, .04)' },
              }}
              title="Staked with"
              subtitle={
                <div
                  sx={{
                    fontSize: 5,
                    fontWeight: 'text',
                    color: 'text',
                    lineHeight: 'heading',
                  }}
                >
                  {process.env.THREEBOX_ENABLED &&
                  data.delegator.delegate.threeBoxSpace.name
                    ? data.delegator.delegate.threeBoxSpace.name
                    : data.delegator.delegate.id.replace(
                        data.delegator.delegate.id.slice(7, 37),
                        '…',
                      )}
                </div>
              }
            />
          </a>
        </Link>
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
          title={
            <Flex sx={{ alignItems: 'center' }}>
              <div sx={{ color: 'muted' }}>Staked balance</div>
              <Flex>
                <ReactTooltip
                  id="tooltip-total-staked"
                  className="tooltip"
                  place="top"
                  type="dark"
                  effect="solid"
                />
                <Help
                  data-tip="This is the amount currently delegated to an Orchestrator."
                  data-for="tooltip-total-staked"
                  sx={{
                    color: 'muted',
                    cursor: 'pointer',
                    ml: 1,
                  }}
                />
              </Flex>
            </Flex>
          }
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
              <Flex sx={{ alignItems: 'center' }}>
                <div sx={{ color: 'muted' }}>Principal</div>
                <Flex>
                  <ReactTooltip
                    id="tooltip-principal"
                    className="tooltip"
                    place="top"
                    type="dark"
                    effect="solid"
                  />
                  <Help
                    data-tip="This is the amount initially staked."
                    data-for="tooltip-principal"
                    sx={{
                      color: 'muted',
                      cursor: 'pointer',
                      ml: 1,
                    }}
                  />
                </Flex>
              </Flex>
              <span sx={{ fontFamily: 'monospace' }}>
                {abbreviateNumber(principal, 3)}
              </span>
            </Flex>
            <Flex
              sx={{
                fontSize: 1,
                mb: 1,
                justifyContent: 'space-between',
              }}
            >
              <Flex sx={{ alignItems: 'center' }}>
                <div sx={{ color: 'muted' }}>Unstaked</div>
                <Flex>
                  <ReactTooltip
                    id="tooltip-unstaked"
                    className="tooltip"
                    place="top"
                    type="dark"
                    effect="solid"
                  />
                  <Help
                    data-tip="This is the amount unstaked over the lifetime of this account."
                    data-for="tooltip-unstaked"
                    sx={{
                      color: 'muted',
                      cursor: 'pointer',
                      ml: 1,
                    }}
                  />
                </Flex>
              </Flex>
              <span sx={{ fontFamily: 'monospace' }}>
                {unbonded > 0 ? (
                  <span sx={{ color: 'red' }}>
                    -{abbreviateNumber(unbonded, 3)}
                  </span>
                ) : (
                  0
                )}
              </span>
            </Flex>
            <Flex sx={{ fontSize: 1, justifyContent: 'space-between' }}>
              <Flex sx={{ alignItems: 'center' }}>
                <div sx={{ color: 'muted' }}>Rewards</div>
                <Flex>
                  <ReactTooltip
                    id="tooltip-rewards"
                    className="tooltip"
                    place="top"
                    type="dark"
                    effect="solid"
                  />
                  <Help
                    data-tip="Account's total rewards earned all-time."
                    data-for="tooltip-rewards"
                    sx={{
                      color: 'muted',
                      cursor: 'pointer',
                      ml: 1,
                    }}
                  />
                </Flex>
              </Flex>
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
            title={
              <Flex sx={{ alignItems: 'center' }}>
                <div sx={{ color: 'muted' }}>Stake Equity</div>
                <Flex>
                  <ReactTooltip
                    id="tooltip-equity"
                    className="tooltip"
                    place="top"
                    type="dark"
                    effect="solid"
                  />
                  <Help
                    data-tip="Account's equity relative to the entire network."
                    data-for="tooltip-equity"
                    sx={{
                      color: 'muted',
                      cursor: 'pointer',
                      ml: 1,
                    }}
                  />
                </Flex>
              </Flex>
            }
            subtitle={
              <div
                sx={{
                  fontSize: 5,
                  color: 'text',
                  lineHeight: 'heading',
                  fontFamily: 'monospace',
                }}
              >
                {totalBondedToken === '0'
                  ? 0
                  : ((pendingStake / totalBondedToken) * 100).toPrecision(4)}
                %
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
                    (
                    {totalBondedToken === '0'
                      ? 0
                      : ((pendingStake / totalBondedToken) * 100).toPrecision(
                          4,
                        )}
                    %)
                  </span>
                </span>
                <span>
                  <span sx={{ fontFamily: 'monospace' }}>
                    {abbreviateNumber(pendingStake, 5)}
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
                    {totalBondedToken === '0'
                      ? 0
                      : (
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
                    {(totalBondedToken === '0'
                      ? 0
                      : (totalBondedToken -
                          Utils.fromWei(data.delegator.delegate.totalStake) -
                          pendingStake) /
                        totalBondedToken) * 100}
                    %)
                  </span>
                </span>
                <span>
                  <span sx={{ fontFamily: 'monospace' }}>
                    {abbreviateNumber(
                      totalBondedToken === '0'
                        ? 0
                        : totalBondedToken -
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
