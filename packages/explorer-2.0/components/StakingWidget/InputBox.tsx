/** @jsx jsx */
import React, { useEffect } from 'react'
import { jsx, Flex, Box } from 'theme-ui'
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
  const tokenBalance =
    account && parseFloat(Utils.fromWei(account.tokenBalance)).toPrecision(4)
  const pendingStake =
    delegator &&
    parseFloat(
      Utils.fromWei(
        delegator.pendingStake
          ? delegator.pendingStake
          : delegator.bondedAmount,
      ),
    ).toPrecision(4)

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
                  onClick={() => setAmount(Utils.fromWei(account.tokenBalance))}
                  sx={{ cursor: 'pointer', color: 'muted' }}
                >
                  <ReactTooltip
                    className="tooltip"
                    place="top"
                    type="dark"
                    effect="solid"
                  />
                  Balance:{' '}
                  <span sx={{ fontFamily: 'monospace' }}>{tokenBalance}</span>
                </div>
              ) : (
                <>
                  {pendingStake && (
                    <div
                      data-tip="Enter max"
                      onClick={() =>
                        setAmount(
                          Utils.fromWei(
                            delegator.pendingStake
                              ? delegator.pendingStake
                              : delegator.bondedAmount,
                          ),
                        )
                      }
                      sx={{ cursor: 'pointer', color: 'muted' }}
                    >
                      <ReactTooltip
                        className="tooltip"
                        place="top"
                        type="dark"
                        effect="solid"
                      />
                      Stake:{' '}
                      <span sx={{ fontFamily: 'monospace' }}>
                        {pendingStake}
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
