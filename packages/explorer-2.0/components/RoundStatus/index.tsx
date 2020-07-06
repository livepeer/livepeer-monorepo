import { Flex } from 'theme-ui'
import Play from '../../public/img/play.svg'
import gql from 'graphql-tag'
import { useQuery, useApolloClient } from '@apollo/react-hooks'
import Modal from '../Modal'
import { Box } from 'theme-ui'
import CircularProgressbar from '../CircularProgressBar'
import { useThemeUI } from 'theme-ui'
import { buildStyles } from 'react-circular-progressbar'
import { MdCheck, MdClose } from 'react-icons/md'
import moment from 'moment'

const GET_ROUND_MODAL_STATUS = gql`
  {
    roundStatusModalOpen @client
  }
`

export default () => {
  const { data: modalData } = useQuery(GET_ROUND_MODAL_STATUS)
  const { data: protocolData, loading: protocolDataloading } = useQuery(
    gql`
      {
        protocol(id: "0") {
          roundLength
          lastInitializedRound
          currentRound {
            id
            startBlock
          }
        }
      }
    `,
    {
      pollInterval: 60000,
    },
  )
  const { data: blockData, loading: blockDataLoading } = useQuery(
    gql`
      {
        block
      }
    `,
    {
      pollInterval: 60000,
    },
  )

  const { theme } = useThemeUI()
  const client = useApolloClient()
  const close = () => {
    client.writeData({
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
    +protocolData.protocol.lastInitializedRound === currentRoundNumber
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
        fontSize: 0,
        fontWeight: 600,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'surface',
        borderRadius: 5,
      }}
      onClick={() =>
        client.writeData({
          data: {
            roundStatusModalOpen: true,
          },
        })
      }
    >
      <Flex
        sx={{
          textTransform: 'capitalize',
          alignItems: 'center',
          fontFamily: 'monospace',
          color: 'primary',
        }}
      >
        <Play sx={{ width: 10, height: 10, mr: 1 }} />
        {process.env.NETWORK}
      </Flex>
      <Box sx={{ height: 16, mx: 1, backgroundColor: 'border', width: 1 }} />
      <Box sx={{ fontFamily: 'monospace' }}>
        Round{' '}
        <Box sx={{ display: 'inline-flex', fontFamily: 'monospace' }}>
          #{currentRoundNumber}
        </Box>
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
                trailColor: theme.colors.border,
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
              {moment()
                .add(timeRemaining, 'seconds')
                .fromNow(true)}
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
