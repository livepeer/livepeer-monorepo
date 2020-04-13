import Confetti from 'react-confetti'
import React from 'react'
import { Spinner, Box } from '@theme-ui/components'
import { Flex } from 'theme-ui'
import Button from '../Button'
import useWindowSize from 'react-use/lib/useWindowSize'
import Modal from '../Modal'
import Flow from '../Flow'
import Broadcast from '../../public/img/wifi.svg'
import NewTab from '../../public/img/open-in-new.svg'
import ProgressBar from '../ProgressBar'
import { useTimeEstimate } from '../../hooks'
import Card from '../Card'

export default ({ tx, isOpen, setIsModalOpen }) => {
  const { timeLeft } = useTimeEstimate({
    startTime: tx?.startTime,
    estimate: tx?.estimate,
  })
  return (
    <Modal
      isOpen={isOpen}
      clickAnywhereToClose={false}
      onDismiss={() => {
        setIsModalOpen(false)
      }}
      title={tx.title}
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
          border: '1px solid',
          borderColor: 'border',
          py: 2,
          px: 3,
          borderRadius: 6,
          mb: 4,
        }}
      >
        <Flex
          sx={{
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
                  Math.floor(((tx?.estimate - timeLeft) / tx?.estimate) * 100) <
                  100
                    ? Math.floor(
                        ((tx?.estimate - timeLeft) / tx?.estimate) * 100,
                      )
                    : '100'
                }%`
              : '0%'}
          </Flex>
          <Box>Sending...</Box>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://${
              process.env.NETWORK === 'rinkeby' ? 'rinkeby.' : ''
            }etherscan.io/tx/${tx?.txHash}`}
          >
            Details
          </a>
        </Flex>
      </Box>

      <Flex
        sx={{
          flexDirection: ['column-reverse', 'column-reverse', 'row'],
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* <>
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
            }etherscan.io/tx/${tx?.txHash}`}
          >
            View on Etherscan <NewTab sx={{ ml: 1, width: 16, height: 16 }} />
          </Button>
        </> */}

        <Button onClick={() => setIsModalOpen(false)} sx={{ width: '100%' }}>
          Close
        </Button>
      </Flex>
    </Modal>
  )
}
