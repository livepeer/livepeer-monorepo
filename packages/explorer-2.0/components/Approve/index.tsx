/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import Utils from 'web3-utils'
import Button from '../Button'
import Modal from '../Modal'
import Spinner from '../Spinner'
import Broadcast from '../../public/img/wifi.svg'
import NewTab from '../../public/img/open-in-new.svg'
import { useWeb3Mutation } from '../../hooks'
import { useWeb3Context } from 'web3-react'
import gql from 'graphql-tag'
import { MAXIUMUM_VALUE_UINT256 } from '../../lib/utils'

interface Props {
  amount?: string
  children: React.ReactNode
}

export default ({ children, amount }: Props) => {
  const [isOpen, setIsModalOpen] = useState(false)
  const context = useWeb3Context()

  const APPROVE = gql`
    mutation approve($type: String!, $amount: String!) {
      txHash: approve(type: $type, amount: $amount)
    }
  `
  const {
    mutate: approve,
    isBroadcasted,
    isMined,
    isMining,
    txHash,
  } = useWeb3Mutation(APPROVE, {
    variables: {
      type: 'bond',
      amount: amount ? Utils.toWei(amount, 'ether') : MAXIUMUM_VALUE_UINT256,
    },
    notifyOnNetworkStatusChange: true,
    context: {
      provider: context.library.currentProvider,
      account: context.account.toLowerCase(),
      returnTxHash: true,
    },
  })

  useEffect(() => {
    if (isBroadcasted) {
      setIsModalOpen(true)
    }
  }, [isBroadcasted])

  return (
    <>
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
        {children}
      </Button>
      <Modal
        isOpen={isOpen}
        setOpen={setIsModalOpen}
        title={isMined ? 'Success!' : 'Broadcasted'}
        Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
      >
        <div sx={{ mb: 4 }}>
          {isMined ? (
            <div>All set! You're ready to begin staking.</div>
          ) : (
            <div>
              Approving {amount ? Utils.fromWei(amount, 'ether') : ''} Livepeer
              tokens for staking...
            </div>
          )}
        </div>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          {!isMined && (
            <Flex sx={{ alignItems: 'center', fontSize: 0 }}>
              <Spinner sx={{ mr: 2 }} />
              {isMining && (
                <div sx={{ color: 'text' }}>
                  Waiting for your transaction to be mined.
                </div>
              )}
            </Flex>
          )}
          {!isMined && (
            <Button
              sx={{ display: 'flex', alignItems: 'center' }}
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://etherscan.io/tx/${txHash}`}
            >
              View on Etherscan <NewTab sx={{ ml: 1, width: 16, height: 16 }} />
            </Button>
          )}
          {isMined && (
            <Button onClick={() => setIsModalOpen(false)} sx={{ ml: 'auto' }}>
              Done
            </Button>
          )}
        </Flex>
      </Modal>
    </>
  )
}
