/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import Utils from 'web3-utils'
import Button from '../Button'
import Modal from '../Modal'
import Spinner from '../Spinner'
import Broadcast from '../../public/img/wifi.svg'
import NewTab from '../../public/img/open-in-new.svg'
import { useApproveMutation } from '../../hooks'

interface Props {
  amount?: string
  children: React.ReactNode
}

export default ({ children, amount }: Props) => {
  const [isOpen, setIsModalOpen] = useState(false)
  const {
    approve,
    isBroadcasted,
    isMined,
    isMining,
    txHash,
  } = useApproveMutation()

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
      {isOpen && (
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
                Approving {amount ? Utils.fromWei(amount, 'ether') : ''}{' '}
                Livepeer tokens for staking...
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
                View on Etherscan{' '}
                <NewTab sx={{ ml: 1, width: 16, height: 16 }} />
              </Button>
            )}
            {isMined && (
              <Button onClick={() => setIsModalOpen(false)} sx={{ ml: 'auto' }}>
                Done
              </Button>
            )}
          </Flex>
        </Modal>
      )}
    </>
  )
}
