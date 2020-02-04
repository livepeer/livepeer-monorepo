import { Box, Flex, Styled } from 'theme-ui'
import * as Utils from 'web3-utils'
import { abbreviateNumber } from '../../lib/utils'
import { useWeb3React } from '@web3-react/core'
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
  const context = useWeb3React()
  const isMyAccount = account === context.account

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

  if (!data?.delegator?.bondedAmount) {
    if (isMyAccount) {
      return (
        <Box sx={{ pt: 4 }}>
          <span sx={{ mr: 2 }}>
            You haven't staked LPT. Stake LPT with an Orchestrator and begin
            earning rewards.
          </span>
          <Link href="/" passHref>
            <Styled.a>View Orchestrators.</Styled.a>
          </Link>
        </Box>
      )
    } else {
      return (
        <Box sx={{ pt: 4 }}>
          <span sx={{ mr: 2 }}>Nothing here.</span>
        </Box>
      )
    }
  }

  const pendingStake = parseFloat(Utils.fromWei(data.delegator.pendingStake))
  const unbonded = data.delegator.unbonded
    ? parseFloat(Utils.fromWei(data.delegator.unbonded))
    : 0
  const principal = parseFloat(Utils.fromWei(data.delegator.principal))
  const rewards = pendingStake + (unbonded ? unbonded : 0) - principal
  const totalBondedToken = parseFloat(
    Utils.fromWei(data.protocol.totalBondedToken),
  )

  return (
    <Box sx={{ pt: 4 }}>
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
                <Box
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
                </Box>
              }
            />
          </a>
        </Link>
      )}
      <Box
        sx={{
          display: 'grid',
          gridGap: 2,
          gridTemplateColumns: [
            '100%',
            '100%',
            `repeat(auto-fit, minmax(128px, 1fr))`,
          ],
          mb: 5,
        }}
      >
        <Card
          sx={{ flex: 1, mb: 0 }}
          title={
            <Flex sx={{ alignItems: 'center' }}>
              <Box sx={{ color: 'muted' }}>Staked balance</Box>
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
            <Box
              sx={{
                fontSize: 5,
                color: 'text',
                lineHeight: 'heading',
                fontFamily: 'monospace',
              }}
            >
              {abbreviateNumber(pendingStake, 5)}
              <span sx={{ ml: 1, fontSize: 1 }}>LPT</span>
            </Box>
          }
        >
          <Box sx={{ mt: 3 }}>
            <Flex sx={{ fontSize: 1, mb: 1, justifyContent: 'space-between' }}>
              <Flex sx={{ alignItems: 'center' }}>
                <Box sx={{ color: 'muted' }}>Principal</Box>
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
                <Box sx={{ color: 'muted' }}>Unstaked</Box>
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
                <Box sx={{ color: 'muted' }}>Rewards</Box>
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
          </Box>
        </Card>
        {data.delegator.delegate && (
          <Card
            sx={{ flex: 1, mb: 0 }}
            title={
              <Flex sx={{ alignItems: 'center' }}>
                <Box sx={{ color: 'muted' }}>Stake Equity</Box>
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
              <Box
                sx={{
                  fontSize: 5,
                  color: 'text',
                  lineHeight: 'heading',
                  fontFamily: 'monospace',
                }}
              >
                {totalBondedToken === 0
                  ? 0
                  : ((pendingStake / totalBondedToken) * 100).toPrecision(4)}
                %
              </Box>
            }
          >
            <Box sx={{ mt: 3 }}>
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
                    {totalBondedToken === 0
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
                    {totalBondedToken === 0
                      ? 0
                      : (
                          (parseFloat(
                            Utils.fromWei(data.delegator.delegate.totalStake),
                          ) /
                            totalBondedToken) *
                          100
                        ).toPrecision(4)}
                    %)
                  </span>
                </span>
                <span>
                  <span sx={{ fontFamily: 'monospace' }}>
                    {abbreviateNumber(
                      parseFloat(
                        Utils.fromWei(data.delegator.delegate.totalStake),
                      ),
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
                    {(totalBondedToken === 0
                      ? 0
                      : (totalBondedToken -
                          parseFloat(
                            Utils.fromWei(data.delegator.delegate.totalStake),
                          ) -
                          pendingStake) /
                        totalBondedToken) * 100}
                    %)
                  </span>
                </span>
                <span>
                  <span sx={{ fontFamily: 'monospace' }}>
                    {abbreviateNumber(
                      totalBondedToken === 0
                        ? 0
                        : totalBondedToken -
                            parseFloat(
                              Utils.fromWei(data.delegator.delegate.totalStake),
                            ) -
                            pendingStake,
                      3,
                    )}
                  </span>
                </span>
              </Flex>
            </Box>
          </Card>
        )}
      </Box>
      <StakeTransactions
        delegator={data.delegator}
        currentRound={data.currentRound[0]}
        isMyAccount={isMyAccount}
      />
    </Box>
  )
}
