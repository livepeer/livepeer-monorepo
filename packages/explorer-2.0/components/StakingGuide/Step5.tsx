/** @jsx jsx */
import { useEffect } from 'react'
import { jsx, Styled } from 'theme-ui'
import Button from '../Button'
import { useApproveMutation } from '../../hooks'
import Spinner from '../Spinner'
import { Flex } from 'theme-ui'
import Router from 'next/router'

export default ({ goTo, nextStep }) => {
  const { approve, isBroadcasted, isMined, txHash } = useApproveMutation()
  useEffect(() => {
    async function goToNextStep() {
      if (isMined) {
        await Router.push('/')
        goTo(nextStep)
      }
    }
    goToNextStep()
  }, [isMined])

  return (
    <div sx={{ py: 1 }}>
      <Styled.h2 sx={{ mb: 2 }}>Set Permissions</Styled.h2>
      <Styled.p>
        Allow Livepeer smart contracts to transfer tokens on your behalf?
      </Styled.p>
      {isBroadcasted && (
        <Flex
          sx={{
            color: 'muted',
            fontSize: 0,
            display: 'flex',
            alignItems: 'center',
            mt: 2,
            mb: 1,
          }}
        >
          <Spinner sx={{ width: 16, height: 16, mr: 1 }} />
          <div>
            Waiting for your{' '}
            <Styled.div
              sx={{ color: 'muted', textDecoration: 'underline' }}
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://etherscan.io/tx/${txHash}`}
            >
              transaction
            </Styled.div>{' '}
            to be mined.
          </div>
        </Flex>
      )}
      <Button
        disabled={isBroadcasted}
        onClick={async () => {
          try {
            await approve()
          } catch (e) {
            return {
              error: e.message.replace('GraphQL error: ', ''),
            }
          }
        }}
        sx={{ position: 'absolute', right: 30, bottom: 16 }}
      >
        {isBroadcasted ? (
          <Flex sx={{ alignItems: 'center' }}>
            <Spinner sx={{ width: 16, height: 16, mr: 1 }} />
            Submitting
          </Flex>
        ) : (
          'Approve'
        )}
      </Button>
    </div>
  )
}
