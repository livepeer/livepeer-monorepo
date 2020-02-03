import React from 'react'
import { Flex, Box } from 'theme-ui'
import Input from './Input'
import Utils from 'web3-utils'
import ReactTooltip from 'react-tooltip'

export default ({
  account,
  action,
  delegator,
  transcoder,
  amount,
  setAmount,
  protocol,
}) => {
  const tokenBalance = account && Utils.fromWei(account.tokenBalance.toString())

  let stake = '0'
  if (
    Utils.fromWei(delegator?.bondedAmount ? delegator?.bondedAmount : '0') >
    Utils.fromWei(delegator?.pendingStake ? delegator?.pendingStake : '0')
  ) {
    stake = Utils.fromWei(
      delegator?.bondedAmount ? delegator?.bondedAmount : '0',
    )
  } else {
    stake = Utils.fromWei(
      delegator?.pendingStake ? delegator?.pendingStake : '0',
    )
  }

  return (
    <div
      sx={{
        borderRadius: 10,
        width: '100%',
        bg: 'background',
      }}
    >
      <Box sx={{ px: 2, py: 2 }}>
        <Box>
          <Flex sx={{ fontSize: 0, mb: 2, justifyContent: 'space-between' }}>
            <div sx={{ color: 'muted' }}>Input</div>

            {account &&
              (action == 'stake' ? (
                <div
                  data-tip="Enter max"
                  data-for="balance"
                  onClick={() => setAmount(tokenBalance)}
                  sx={{ cursor: 'pointer', color: 'muted' }}
                >
                  <ReactTooltip
                    id="balance"
                    className="tooltip"
                    place="top"
                    type="dark"
                    effect="solid"
                  />
                  Balance:{' '}
                  <span sx={{ fontFamily: 'monospace' }}>
                    {parseFloat(tokenBalance)}
                  </span>
                </div>
              ) : (
                <>
                  {stake && (
                    <div
                      data-tip="Enter max"
                      data-for="stake"
                      onClick={() => setAmount(stake)}
                      sx={{ cursor: 'pointer', color: 'muted' }}
                    >
                      <ReactTooltip
                        id="stake"
                        className="tooltip"
                        place="top"
                        type="dark"
                        effect="solid"
                      />
                      Stake:{' '}
                      <span sx={{ fontFamily: 'monospace' }}>
                        {parseFloat(stake).toPrecision(4)}
                      </span>
                    </div>
                  )}
                </>
              ))}
          </Flex>
          <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Input
              transcoder={transcoder}
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAmount(e.target.value ? e.target.value : '')
              }
              protocol={protocol}
            />
          </Flex>
        </Box>
      </Box>
    </div>
  )
}
