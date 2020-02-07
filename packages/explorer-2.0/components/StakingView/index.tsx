import { Box, Flex, Styled } from 'theme-ui'
import * as Utils from 'web3-utils'
import { abbreviateNumber } from '../../lib/utils'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import gql from 'graphql-tag'
import Card from '../../components/Card'
import Link from 'next/link'
import StakeTransactions from '../StakeTransactions'
import ReactTooltip from 'react-tooltip'
import Help from '../../public/img/help.svg'
import Button from '../Button'

const GET_DATA = gql`
  query {
    protocol {
      totalTokenSupply
      totalBondedToken
    }
    currentRound: rounds(first: 1, orderBy: timestamp, orderDirection: desc) {
      id
    }
  }
`

export default ({ delegator, protocol, currentRound }) => {
  const router = useRouter()
  const query = router.query
  const account = query.account as string
  const context = useWeb3React()
  const isMyAccount = account === context.account

  if (!delegator?.bondedAmount) {
    if (isMyAccount) {
      return (
        <Box sx={{ pt: 4 }}>
          <Box sx={{ mr: 2, mb: 2 }}>
            You haven't staked LPT. Stake with an Orchestrator to begin earning
            rewards and a share of the fees being paid into the Livepeer
            network.
          </Box>
          <Link href="/" passHref>
            <a>
              <Button variant="outline" as="div">
                View Orchestrators
              </Button>
            </a>
          </Link>
        </Box>
      )
    } else {
      return <Box sx={{ pt: 4 }}>Nothing here.</Box>
    }
  }

  const pendingStake = parseFloat(Utils.fromWei(delegator.pendingStake))
  const unbonded = delegator.unbonded
    ? parseFloat(Utils.fromWei(delegator.unbonded))
    : 0
  const principal = parseFloat(Utils.fromWei(delegator.principal))
  const rewards = pendingStake + (unbonded ? unbonded : 0) - principal
  const totalBondedToken = parseFloat(Utils.fromWei(protocol.totalBondedToken))

  return (
    <Box sx={{ pt: 4 }}>
      {delegator.delegate && (
        <Link
          href={`/accounts/[account]/[slug]`}
          as={`/accounts/${delegator.delegate.id}/campaign`}
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
                  delegator.delegate.threeBoxSpace.name
                    ? delegator.delegate.threeBoxSpace.name
                    : delegator.delegate.id.replace(
                        delegator.delegate.id.slice(7, 37),
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
        {delegator.delegate && (
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
                            Utils.fromWei(delegator.delegate.totalStake),
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
                      parseFloat(Utils.fromWei(delegator.delegate.totalStake)),
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
                            Utils.fromWei(delegator.delegate.totalStake),
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
                              Utils.fromWei(delegator.delegate.totalStake),
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
        delegator={delegator}
        currentRound={currentRound}
        isMyAccount={isMyAccount}
      />
    </Box>
  )
}
