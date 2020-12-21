import React from 'react'
import { Spinner, Box } from '@theme-ui/components'
import { Flex } from 'theme-ui'
import Button from '../Button'
import Modal from '../Modal'
import { useTimeEstimate } from '../../hooks'
import { txMessages } from '../../lib/utils'
import Utils from 'web3-utils'
import moment from 'moment'
import { MdOpenInNew } from 'react-icons/md'

const Index = ({ tx, isOpen, onDismiss }) => {
  if (!isOpen) {
    return null
  }
  const { timeLeft } = useTimeEstimate({
    startTime: tx?.startTime,
    estimate: tx?.estimate,
  })
  return (
    <Modal
      isOpen={isOpen}
      clickAnywhereToClose={false}
      onDismiss={onDismiss}
      title="Sending"
      Icon={<Spinner variant="styles.spinner" />}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: timeLeft
            ? `${((tx?.estimate - timeLeft) / tx?.estimate) * 100}%`
            : '0%',
          height: 4,
          background:
            'linear-gradient(260.35deg, #F1BC00 0.25%, #E926BE 47.02%, #9326E9 97.86%)',
        }}
      />

      <Box
        sx={{
          borderRadius: 10,
          border: '1px solid',
          borderColor: 'border',
          mb: 3,
        }}
      >
        <Header tx={tx} timeLeft={timeLeft} />
        <Box
          sx={{
            px: 2,
            py: 3,
          }}
        >
          {Table({ tx, timeLeft })}
        </Box>
      </Box>

      <Button onClick={() => onDismiss()} sx={{ width: '100%' }}>
        Close
      </Button>
    </Modal>
  )
}

export default Index

function Table({ tx, timeLeft }) {
  return (
    <Box>
      <Row>
        <Box>Your account</Box> {tx.from.replace(tx.from.slice(7, 37), '…')}
      </Row>
      <Inputs tx={tx} />
      <Row>
        <Box>Max Transaction fee</Box>{' '}
        {tx.gasPrice && tx.gas
          ? `${parseFloat(Utils.fromWei(tx.gasPrice)) * tx.gas} ETH`
          : 'Estimating...'}
      </Row>
      <Row sx={{ mb: 0 }}>
        <Box>Estimated wait</Box>{' '}
        {timeLeft
          ? `~${moment.duration(timeLeft, 'seconds').humanize()} remaining`
          : 'Estimating...'}
      </Row>
    </Box>
  )
}

function Inputs({ tx }) {
  const inputData = JSON.parse(tx.inputData)
  switch (tx.__typename) {
    case 'bond':
      return (
        <>
          <Row>
            <Box>Delegate</Box>{' '}
            {inputData && inputData.to.replace(inputData.to.slice(7, 37), '…')}
          </Row>

          <Row>
            <Box>Amount</Box> {tx.inputData && Utils.fromWei(inputData.amount)}{' '}
            LPT
          </Row>
        </>
      )
    case 'unbond':
      return (
        <>
          <Row>
            <Box>Amount</Box> {tx.inputData && Utils.fromWei(inputData.amount)}{' '}
            LPT
          </Row>
        </>
      )
    case 'rebondFromUnbonded':
      return (
        <>
          <Row>
            <Box>Delegate</Box>{' '}
            {tx.inputData &&
              inputData.delegate.replace(inputData.delegate.slice(7, 37), '…')}
          </Row>
        </>
      )
    case 'vote':
      return (
        <>
          <Row>
            <Box>Vote</Box>{' '}
            {tx.inputData && inputData.choiceId === 0 ? 'Yes' : 'No'}
          </Row>
        </>
      )
    case 'batchClaimEarnings':
      return (
        <>
          <Row>
            <Box>Total Rounds</Box> {tx.inputData && inputData.totalRounds}
          </Row>
        </>
      )
    case 'createPoll':
      return null
    case 'withdrawStake':
      null
    case 'withdrawFees':
      null
    case 'rebond':
      null
    case 'approve':
      return null
    default:
      return null
  }
}

function Row({ children, ...props }) {
  return (
    <Flex
      sx={{
        mb: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 1,
      }}
      {...props}
    >
      {children}
    </Flex>
  )
}

function Header({ tx, timeLeft }) {
  return (
    <Flex
      sx={{
        borderBottom: '1px solid',
        borderColor: 'border',
        p: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Flex
        sx={{
          mr: 2,
          color: 'white',
          fontSize: 0,
          fontWeight: 'bold',
        }}
      >
        {timeLeft
          ? `${
              Math.floor(((tx?.estimate - timeLeft) / tx?.estimate) * 100) < 100
                ? Math.floor(((tx?.estimate - timeLeft) / tx?.estimate) * 100)
                : '100'
            }%`
          : '0%'}
      </Flex>
      <Box sx={{ fontWeight: 700 }}>{txMessages[tx?.__typename]?.pending}</Box>
      <a
        sx={{ display: 'flex', alignItems: 'center' }}
        target="_blank"
        rel="noopener noreferrer"
        href={`https://${
          process.env.NEXT_PUBLIC_NETWORK === 'rinkeby' ? 'rinkeby.' : ''
        }etherscan.io/tx/${tx?.txHash}`}
      >
        Details <MdOpenInNew sx={{ ml: '6px', color: 'primary' }} />
      </a>
    </Flex>
  )
}
