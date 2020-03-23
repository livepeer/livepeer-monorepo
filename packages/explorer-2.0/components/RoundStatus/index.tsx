import { useState, useEffect } from 'react'
import { Flex } from 'theme-ui'
import Play from '../../public/img/play.svg'
import { useWeb3React } from '@web3-react/core'
import gql from 'graphql-tag'
import { useQuery, useApolloClient } from '@apollo/react-hooks'
import Modal from '../Modal'
import { Box } from 'theme-ui'
import CircularProgressbar from '../CircularProgressBar'
import { useThemeUI } from 'theme-ui'
import { buildStyles } from 'react-circular-progressbar'
import { MdCheck, MdClose } from 'react-icons/md'
import LivepeerSDK from '@livepeer/sdk'
import moment from 'moment'

const GET_ROUND_MODAL_STATUS = gql`
  {
    roundStatusModalOpen @client
  }
`

export default () => {
  const { data: modalData } = useQuery(GET_ROUND_MODAL_STATUS)
  const { theme } = useThemeUI()
  const [currentRoundInfo, setCurrentRoundInfo] = useState({
    id: null,
    blockNumber: null,
    initialized: null,
    lastInitializedRound: null,
    length: null,
    startBlock: null,
    blocksRemaining: null,
    percentage: null,
    blocksSinceCurrentRoundStart: null,
    timeRemaining: null,
  })

  const close = () => {
    client.writeData({
      data: {
        roundStatusModalOpen: false,
      },
    })
  }

  const context = useWeb3React()
  const client = useApolloClient()

  useEffect(() => {
    const init = async () => {
      const { rpc } = await LivepeerSDK({
        provider:
          context.chainId === 4 ? process.env.RPC_URL_4 : process.env.RPC_URL_1,
        controllerAddress:
          context.chainId === 4
            ? process.env.CONTROLLER_ADDRESS_RINKEBY
            : process.env.CONTROLLER_ADDRESS_MAINNET,
      })
      const { number } = await rpc.getBlock('latest')
      const {
        id,
        initialized,
        lastInitializedRound,
        length,
        startBlock,
      } = await rpc.getCurrentRoundInfo()
      const response = await fetch(
        'https://ethgasstation.info/json/ethgasAPI.json',
      )
      const ethGasStationResult = await response.json()
      const blocksSinceCurrentRoundStart = number - startBlock
      const blocksRemaining = length - (number - startBlock)
      const percentage = (blocksSinceCurrentRoundStart / length) * 100

      setCurrentRoundInfo({
        id,
        initialized,
        lastInitializedRound,
        length,
        startBlock,
        blockNumber: number,
        blocksRemaining,
        percentage,
        blocksSinceCurrentRoundStart,
        timeRemaining: ethGasStationResult.block_time * blocksRemaining,
      })
    }

    init()

    // refetch every few blocks
    const interval = setInterval(async () => {
      init()
    }, 40000)

    return () => {
      clearInterval(interval)
    }
  }, [])

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
        sx={{ alignItems: 'center', fontFamily: 'monospace', color: 'primary' }}
      >
        <Play sx={{ width: 10, height: 10, mr: 1 }} />
        {context.chainId
          ? context.chainId == 1
            ? 'Mainnet'
            : 'Rinkeby'
          : 'Mainnet'}
      </Flex>
      <Box sx={{ height: 16, mx: 1, backgroundColor: 'border', width: 1 }} />
      <Box sx={{ fontFamily: 'monospace' }}>
        Round{' '}
        <Box sx={{ display: 'inline-flex', fontFamily: 'monospace' }}>
          #{currentRoundInfo.id}
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
            <Box>Round #{currentRoundInfo.id}</Box>
            <Flex sx={{ alignItems: 'center', fontSize: 1, fontWeight: 600 }}>
              Initialized{' '}
              {currentRoundInfo.initialized ? (
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
              value={Math.round(currentRoundInfo.percentage)}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ fontWeight: 'bold', fontSize: 4 }}>
                  {currentRoundInfo.blocksSinceCurrentRoundStart}
                </Box>
                <Box sx={{ fontSize: 0 }}>
                  of {currentRoundInfo.length} blocks
                </Box>
              </Box>
            </CircularProgressbar>
          </Box>
          <Box>
            There are{' '}
            <strong sx={{ borderBottom: '1px dashed', borderColor: 'text' }}>
              {currentRoundInfo.blocksRemaining} blocks
            </strong>{' '}
            and approximately{' '}
            <strong sx={{ borderBottom: '1px dashed', borderColor: 'text' }}>
              {moment()
                .add(currentRoundInfo.timeRemaining, 'seconds')
                .fromNow(true)}
            </strong>{' '}
            remaining until the current round ends and round{' '}
            <strong sx={{ borderBottom: '1px dashed', borderColor: 'text' }}>
              #{parseInt(currentRoundInfo.id) + 1}
            </strong>{' '}
            begins.
          </Box>
        </Flex>
      </Modal>
    </Flex>
  )
}
