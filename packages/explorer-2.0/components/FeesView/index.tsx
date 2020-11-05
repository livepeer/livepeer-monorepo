import { Flex } from 'theme-ui'
import Utils from 'web3-utils'
import Card from '../Card'
import NumberFormat from 'react-number-format'
import { Box } from 'theme-ui'
import Button from '../Button'
import ReactTooltip from 'react-tooltip'
import Help from '../../public/img/help.svg'
import Link from 'next/link'
import WithdrawFees from '../WithdrawFees'

const Index = ({ delegator, currentRound, isMyAccount }) => {
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

  const lifetimeEarnings = Utils.toBN(delegator.pendingFees)
    .add(Utils.toBN(delegator.withdrawnFees ? delegator.withdrawnFees : '0'))
    .toString()

  const withdrawButtonDisabled = delegator.pendingFees === '0'

  return (
    <Box sx={{ pt: 4 }}>
      <>
        <Box
          sx={{
            display: 'grid',
            gridGap: 2,
            gridTemplateColumns: [
              'repeat(auto-fit, minmax(100%, 1fr))',
              'repeat(auto-fit, minmax(100%, 1fr))',
              'repeat(auto-fit, minmax(40%, 1fr))',
            ],
          }}
        >
          <Card
            title="Lifetime Earnings"
            subtitle={
              <Box
                sx={{
                  fontSize: [3, 3, 4, 4],
                  color: 'text',
                  fontWeight: 500,
                  lineHeight: 'heading',
                  fontFamily: 'monospace',
                }}
              >
                <NumberFormat
                  value={Utils.fromWei(lifetimeEarnings)}
                  displayType="text"
                  decimalScale={13}
                />
                <span sx={{ ml: 1, fontSize: 1 }}>ETH</span>
              </Box>
            }
          >
            <Box sx={{ mt: 3 }}>
              <Flex
                sx={{
                  mb: 1,
                  fontSize: 1,
                  justifyContent: 'space-between',
                }}
              >
                <Flex sx={{ alignItems: 'center' }}>
                  <Box sx={{ color: 'muted' }}>Pending</Box>
                  <Flex>
                    <ReactTooltip
                      id="tooltip-pending-withdrawal"
                      className="tooltip"
                      place="top"
                      type="dark"
                      effect="solid"
                    />
                    <Help
                      data-tip="Total fees pending withdrawal"
                      data-for="tooltip-pending-withdrawal"
                      sx={{
                        color: 'muted',
                        cursor: 'pointer',
                        ml: 1,
                      }}
                    />
                  </Flex>
                </Flex>
                <span sx={{ fontFamily: 'monospace' }}>
                  <NumberFormat
                    value={Utils.fromWei(delegator.pendingFees)}
                    displayType="text"
                    decimalScale={13}
                  />{' '}
                  ETH
                </span>
              </Flex>
              <Flex
                sx={{
                  fontSize: 1,
                  justifyContent: 'space-between',
                }}
              >
                <Flex sx={{ alignItems: 'center' }}>
                  <Box sx={{ color: 'muted' }}>Withdrawn</Box>
                  <Flex>
                    <ReactTooltip
                      id="tooltip-withdrawn"
                      className="tooltip"
                      place="top"
                      type="dark"
                      effect="solid"
                    />
                    <Help
                      data-tip="Total fees withdrawn over the lifetime of this account."
                      data-for="tooltip-withdrawn"
                      sx={{
                        color: 'muted',
                        cursor: 'pointer',
                        ml: 1,
                      }}
                    />
                  </Flex>
                </Flex>
                <span sx={{ fontFamily: 'monospace' }}>
                  <NumberFormat
                    value={Utils.fromWei(
                      delegator.withdrawnFees ? delegator.withdrawnFees : '0',
                    )}
                    displayType="text"
                    decimalScale={13}
                  />{' '}
                  ETH
                </span>
              </Flex>
            </Box>
          </Card>
          {isMyAccount && (
            <Card
              title="Pending Withdrawal"
              subtitle={
                <Box
                  sx={{
                    fontSize: [3, 3, 4, 4],
                    mb: 2,
                    color: 'text',
                    fontWeight: 500,
                    lineHeight: 'heading',
                    fontFamily: 'monospace',
                  }}
                >
                  <NumberFormat
                    value={Utils.fromWei(delegator.pendingFees)}
                    displayType="text"
                    decimalScale={13}
                  />
                  <span sx={{ ml: 1, fontSize: 1 }}>ETH</span>
                </Box>
              }
            >
              <WithdrawFees
                delegator={delegator}
                disabled={withdrawButtonDisabled}
                sx={{ mt: [2, 2, 'auto'] }}
              >
                Withdraw
              </WithdrawFees>
            </Card>
          )}
        </Box>
      </>
    </Box>
  )
}

export default Index
