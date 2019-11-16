/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import Button from '../Button'
import Modal from '../Modal'
import Spinner from '../Spinner'
import Broadcast from '../../public/img/wifi.svg'
import NewTab from '../../public/img/open-in-new.svg'
import { useWeb3Mutation } from '../../hooks'
import { useWeb3Context } from 'web3-react'
import gql from 'graphql-tag'
import { MAXIUMUM_VALUE_UINT256 } from '../../lib/utils'
import Banner from '../Banner'

export default ({ account, context }) => {
  if (!account) {
    return null
  }

  const [approveModalOpen, setApproveModalOpen] = useState(false)

  const APPROVE = gql`
    mutation approve($type: String!, $amount: String!) {
      txHash: approve(type: $type, amount: $amount)
    }
  `
  const {
    result: { mutate: approve, isBroadcasted, isMined, txHash },
    reset,
  } = useWeb3Mutation(APPROVE, {
    variables: {
      type: 'bond',
      amount: MAXIUMUM_VALUE_UINT256,
    },
    context: {
      provider: context.library.currentProvider,
      account: context.account.toLowerCase(),
      returnTxHash: true,
    },
  })

  useEffect(() => {
    if (isBroadcasted) {
      setApproveModalOpen(true)
    }
  }, [isBroadcasted])

  let banner = null

  if (
    account &&
    account.id.toLowerCase() == context.account.toLowerCase() &&
    parseFloat(account.allowance) == 0 &&
    parseFloat(account.tokenBalance) != 0
  ) {
    banner = (
      <Banner
        label={<div sx={{ pr: 3 }}>Approve Livepeer tokens for staking.</div>}
        button={
          <Button
            onClick={async () => {
              try {
                await approve()
              } catch (e) {
                return {
                  error: e.message.replace('GraphQL error: ', ''),
                }
              }
            }}
          >
            Approve
          </Button>
        }
      />
    )
  }

  return (
    <>
      <Modal
        isOpen={approveModalOpen}
        onDismiss={() => {
          reset()
          setApproveModalOpen(false)
        }}
        title={isMined ? 'Success!' : 'Broadcasted'}
        Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
      >
        <Flex
          sx={{
            border: '1px solid',
            borderColor: 'border',
            borderRadius: 6,
            p: 3,
            alignItems: 'center',
            justifyContent: 'center',
            my: 5,
          }}
        >
          {isMined ? (
            <div>All set! You're ready to begin staking.</div>
          ) : (
            <div>Approving Livepeer tokens for staking...</div>
          )}
        </Flex>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          {txHash && !isMined && (
            <>
              <Flex sx={{ alignItems: 'center', fontSize: 0 }}>
                <Spinner sx={{ mr: 2 }} />
                <div sx={{ color: 'text' }}>
                  Waiting for your transaction to be mined.
                </div>
              </Flex>
              <Button
                sx={{ display: 'flex', alignItems: 'center' }}
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://etherscan.io/tx/${txHash}`}
              >
                View on Etherscan{' '}
                <NewTab sx={{ ml: 1, width: 16, height: 16 }} />
              </Button>
            </>
          )}
          {isMined && (
            <Button
              onClick={() => setApproveModalOpen(false)}
              sx={{ ml: 'auto' }}
            >
              Done
            </Button>
          )}
        </Flex>
      </Modal>
      {banner}
    </>
  )
}
