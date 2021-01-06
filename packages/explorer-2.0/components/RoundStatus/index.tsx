import { Flex } from 'theme-ui'
import Play from '../../public/img/play.svg'
import gql from 'graphql-tag'
import { useQuery, useApolloClient } from '@apollo/client'
import Modal from '../Modal'
import { Box } from 'theme-ui'
import CircularProgressbar from '../CircularProgressBar'
import { useThemeUI } from 'theme-ui'
import { buildStyles } from 'react-circular-progressbar'
import { MdCheck, MdClose } from 'react-icons/md'
import moment from 'moment'
import { useEffect } from 'react'
import { usePageVisibility } from '../../hooks'

const GET_ROUND_MODAL_STATUS = gql`
  {
    roundStatusModalOpen @client
  }
`

const Index = () => {
  const isVisible = usePageVisibility()
  const { data: modalData } = useQuery(GET_ROUND_MODAL_STATUS)
  const pollInterval = 60000
  const {
    data: protocolData,
    loading: protocolDataloading,
    startPolling: startPollingProtocol,
    stopPolling: stopPollingProtocol,
  } = useQuery(
    gql`
      {
        protocol(id: "0") {
          id
          roundLength
          lastInitializedRound {
            id
          }
          currentRound {
            id
            startBlock
          }
        }
      }
    `,
    {
      pollInterval,
    },
  )
  const {
    data: blockData,
    loading: blockDataLoading,
    startPolling: startPollingBlock,
    stopPolling: stopPollingBlock,
  } = useQuery(
    gql`
      {
        block
      }
    `,
    {
      pollInterval,
    },
  )

  const { theme } = useThemeUI()
  const client = useApolloClient()

  useEffect(() => {
    if (!isVisible) {
      stopPollingProtocol()
      stopPollingBlock()
    } else {
      startPollingProtocol(pollInterval)
      startPollingBlock(pollInterval)
    }
  }, [isVisible])

  const close = () => {
    client.writeQuery({
      query: gql`
        query {
          roundStatusModalOpen
        }
      `,
      data: {
        roundStatusModalOpen: false,
      },
    })
  }

  if (protocolDataloading || blockDataLoading) {
    return null
  }

  const currentRoundNumber = Math.floor(
    blockData.block.number / protocolData.protocol.roundLength,
  )
  const initialized =
    +protocolData.protocol.lastInitializedRound.id === currentRoundNumber
  const blocksRemaining = initialized
    ? +protocolData.protocol.roundLength -
      (blockData.block.number - +protocolData.protocol.currentRound.startBlock)
    : 0
  const timeRemaining = blockData.block.time * blocksRemaining
  const blocksSinceCurrentRoundStart = initialized
    ? blockData.block.number - +protocolData.protocol.currentRound.startBlock
    : 0
  const percentage =
    (blocksSinceCurrentRoundStart / +protocolData.protocol.roundLength) * 100

  return (
    <Flex
      sx={{
        cursor: 'pointer',
        py: 1,
        px: 2,
        fontSize: 1,
        fontWeight: 600,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      variant="buttons.transparent"
      onClick={() =>
        client.writeQuery({
          query: gql`
            query {
              roundStatusModalOpen
            }
          `,
          data: {
            roundStatusModalOpen: true,
          },
        })
      }
    >
      <Box>
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'monospace',
          }}
        >
          <Box
            sx={{
              width: 16,
              minWidth: 16,
              height: 16,
              minHeight: 16,
              mr: 12,
            }}
          >
            <CircularProgressbar
              strokeWidth={10}
              styles={buildStyles({
                strokeLinecap: 'butt',
                pathColor: theme.colors.primary,
                textColor: theme.colors.text,
                trailColor: '#393a3d',
              })}
              value={Math.round(percentage)}
            />
          </Box>
          Round #{currentRoundNumber}
        </Flex>
      </Box>
      <Modal
        showCloseButton={false}
        onDismiss={close}
        isOpen={modalData?.roundStatusModalOpen}
        title={
          <Flex
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Box>Round #{currentRoundNumber}</Box>
            <Flex sx={{ alignItems: 'center', fontSize: 1, fontWeight: 600 }}>
              Initialized{' '}
              {initialized ? (
                <MdCheck
                  sx={{ ml: 1, width: 20, height: 20, color: 'primary' }}
                />
              ) : (
                <MdClose sx={{ ml: 1, width: 20, height: 20, color: 'red' }} />
              )}
            </Flex>
          </Flex>
        }
      >
        <Flex
          sx={{ pb: 3, justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Box
            sx={{
              width: 160,
              minWidth: 160,
              height: 160,
              minHeight: 160,
              mr: 8,
              display: ['none', 'none', 'block'],
            }}
          >
            <CircularProgressbar
              strokeWidth={10}
              styles={buildStyles({
                strokeLinecap: 'butt',
                pathColor: theme.colors.primary,
                textColor: theme.colors.text,
                trailColor: '#393a3d',
              })}
              value={Math.round(percentage)}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ fontWeight: 'bold', fontSize: 4 }}>
                  {blocksSinceCurrentRoundStart}
                </Box>
                <Box sx={{ fontSize: 0 }}>
                  of {protocolData.protocol.roundLength} blocks
                </Box>
              </Box>
            </CircularProgressbar>
          </Box>
          <Box>
            There are{' '}
            <strong sx={{ borderBottom: '1px dashed', borderColor: 'text' }}>
              {blocksRemaining} blocks
            </strong>{' '}
            and approximately{' '}
            <strong sx={{ borderBottom: '1px dashed', borderColor: 'text' }}>
              {moment().add(timeRemaining, 'seconds').fromNow(true)}
            </strong>{' '}
            remaining until the current round ends and round{' '}
            <strong sx={{ borderBottom: '1px dashed', borderColor: 'text' }}>
              #{currentRoundNumber + 1}
            </strong>{' '}
            begins.
          </Box>
        </Flex>
      </Modal>
    </Flex>
  )
}

export default Index
