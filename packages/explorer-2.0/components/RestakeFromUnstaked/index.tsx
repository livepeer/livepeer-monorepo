import { useContext } from 'react'
import { useWeb3React } from '@web3-react/core'
import Button from '../Button'
import { MutationsContext } from '../../contexts'
import { useApolloClient } from '@apollo/react-hooks'

export default ({ lock }) => {
  const context = useWeb3React()
  const client = useApolloClient()

  if (!context.active) {
    return null
  }

  const { rebondFromUnbonded }: any = useContext(MutationsContext)

  return (
    <>
      <Button
        onClick={async () => {
          try {
            client.writeData({
              data: {
                txSummaryModal: {
                  __typename: 'TxSummaryModal',
                  open: true,
                },
              },
            })
            await rebondFromUnbonded({
              variables: {
                unbondingLockId: lock.unbondingLockId,
                delegate: lock.delegate.id,
              },
            })
            client.writeData({
              data: {
                txSummaryModal: {
                  __typename: 'TxSummaryModal',
                  open: false,
                },
              },
            })
          } catch (e) {
            client.writeData({
              data: {
                txSummaryModal: {
                  __typename: 'TxSummaryModal',
                  error: true,
                },
              },
            })
            return {
              error: e.message.replace('GraphQL error: ', ''),
            }
          }
        }}
        sx={{ py: 1, mr: 2, variant: 'buttons.secondary' }}
      >
        Rebond
      </Button>

      {/* <Modal
        isOpen={isOpen}
        onDismiss={() => {
          reset()
          setIsModalOpen(false)
        }}
        title={isMined ? 'Successfully Rebonded' : 'Broadcasted'}
        Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
      >
        <Flow
          action="stake"
          account={lock.delegate.id}
          amount={parseFloat(Utils.fromWei(lock.amount))}
        />
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
                href={`https://${
                  process.env.NETWORK === 'rinkeby' ? 'rinkeby.' : ''
                }etherscan.io/tx/${txHash}`}
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
      </Modal> */}
    </>
  )
}
