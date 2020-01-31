import { Flex } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/react-hooks'
import Utils from 'web3-utils'
import Button from '../Button'
import Modal from '../Modal'
import StakingFlow from '../StakingFlow'
import Spinner from '../Spinner'
import Broadcast from '../../public/img/wifi.svg'
import NewTab from '../../public/img/open-in-new.svg'
import { useWeb3React } from '@web3-react/core'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { useWeb3Mutation } from '../../hooks'
import gql from 'graphql-tag'

export default ({ transcoder, amount, disabled }) => {
  const client = useApolloClient()
  const context = useWeb3React()
  const [isOpen, setIsModalOpen] = useState(false)
  const { width, height } = useWindowSize()

  // Can only stake if connected to wallet
  if (!context.active) {
    return null
  }

  const BOND = gql`
    mutation bond($to: String!, $amount: String!) {
      txHash: bond(to: $to, amount: $amount)
    }
  `

  const {
    result: { mutate: bond, isBroadcasted, isMined, txHash },
    reset,
  } = useWeb3Mutation(BOND, {
    variables: {
      to: transcoder.id,
      amount: Utils.toWei(amount ? amount.toString() : '0'),
    },
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
        disabled={disabled}
        onClick={async () => {
          try {
            await bond()
            client.writeData({
              data: {
                tourOpen: false,
              },
            })
          } catch (e) {
            console.log(e)
            return {
              error: e.message.replace('GraphQL error: ', ''),
            }
          }
        }}
        sx={{ width: '100%' }}
      >
        Stake
      </Button>
      <Modal
        isOpen={isOpen}
        onDismiss={() => {
          reset()
          setIsModalOpen(false)
        }}
        title={isMined ? 'Success!' : 'Broadcasted'}
        Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
      >
        {isMined && (
          <Confetti
            canvasRef={React.createRef()}
            width={width}
            height={height}
          />
        )}
        <StakingFlow action="stake" account={transcoder.id} amount={amount} />
        <Flex
          sx={{
            flexDirection: ['column-reverse', 'column-reverse', 'row'],
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {txHash && !isMined && (
            <>
              <Flex sx={{ alignItems: 'center', fontSize: 0 }}>
                <Spinner sx={{ mr: 2 }} />
                <div sx={{ color: 'text' }}>
                  Waiting for your transaction to be mined.
                </div>
              </Flex>
              <Button
                sx={{
                  mb: [2, 2, 0],
                  justifyContent: 'center',
                  width: ['100%', '100%', 'auto'],
                  display: 'flex',
                  alignItems: 'center',
                }}
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
            <Button onClick={() => setIsModalOpen(false)} sx={{ ml: 'auto' }}>
              Done
            </Button>
          )}
        </Flex>
      </Modal>
    </>
  )
}
