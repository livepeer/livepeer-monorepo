import { NetworkStatus, useQuery } from '@apollo/client'
import { Box, Flex, Styled } from 'theme-ui'
import PerformanceTable from './PerformanceTable'
import StakingTable from './StakingTable'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import {
  Menu,
  MenuItemRadioGroup,
  MenuItemRadio,
} from '@modulz/radix/dist/index.es'
import Spinner from '../Spinner'
import { usePageVisibility } from '../../hooks'
import orchestratorsViewQuery from '../../queries/orchestratorsView.gql'

const regions = {
  global: 'Global',
  sin: 'Asia (Singapore)',
  fra: 'Europe (Frankfurt)',
  mdw: 'North America (Chicago)',
}

const TimeframeToggle = ({ refetch, timeframe, setTimeframe }) => {
  return (
    <Flex sx={{ alignItems: 'center' }}>
      <Box
        onClick={async () => {
          await setTimeframe('1D')
          await refetch()
        }}
        sx={{
          fontSize: 0,
          borderRadius: 8,
          fontWeight: 600,
          cursor: 'pointer',
          border: '1px solid',
          borderColor: 'rgba(255,255,255,.1)',
          bg: timeframe === '1D' ? 'rgba(255,255,255,.1)' : 'transparent',
          py: '6px',
          px: 1,
          mr: 1,
        }}
      >
        1D
      </Box>
      <Box
        onClick={async () => {
          await setTimeframe('1W')
          await refetch()
        }}
        sx={{
          fontSize: 0,
          borderRadius: 8,
          fontWeight: 600,
          cursor: 'pointer',
          border: '1px solid',
          borderColor: 'rgba(255,255,255,.1)',
          bg: timeframe === '1W' ? 'rgba(255,255,255,.1)' : 'transparent',
          py: '6px',
          px: 1,
        }}
      >
        1W
      </Box>
    </Flex>
  )
}

const oneDayAgo = Math.floor(
  new Date(new Date().setDate(new Date().getDate() - 1)).getTime() / 1000,
)
const oneWeekAgo = Math.floor(
  new Date(new Date().setDate(new Date().getDate() - 7)).getTime() / 1000,
)

const Index = ({ pageSize = 10, title = '' }) => {
  const router = useRouter()
  const { query } = router
  const isVisible = usePageVisibility()
  const pollInterval = 20000
  const [isRegionSelectorOpen, setIsRegionSelectorOpen] = useState(false)
  const [region, setRegion] = useState('global')
  const targetRef = useRef()
  const [timeframe, setTimeframe] = useState('1D')
  const [orchestratorTable, setOrchestratorTable] = useState('staking')

  const variables = {
    orderBy: 'totalStake',
    orderDirection: 'desc',
    where: {
      status: 'Registered',
    },
  }

  const {
    data,
    refetch,
    networkStatus,
    startPolling: startPollingOrchestrators,
    stopPolling: stopPollingOrchestrators,
  } = useQuery(orchestratorsViewQuery, {
    variables,
    notifyOnNetworkStatusChange: true,
    pollInterval: 20000,
    context: {
      since: timeframe === '1W' ? oneWeekAgo : oneDayAgo,
    },
  })

  useEffect(() => {
    if (!isVisible) {
      stopPollingOrchestrators()
    } else {
      startPollingOrchestrators(pollInterval)
    }
  }, [isVisible])

  const performanceViewActive =
    query?.orchestratorTable === 'performance' ||
    orchestratorTable === 'performance'

  return (
    <Box className="tour-step-6">
      {title && (
        <Styled.h2 sx={{ fontWeight: 500, fontSize: 18, mb: 2 }}>
          {title}
        </Styled.h2>
      )}
      <Box
        sx={{
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 10px',
          position: 'relative',
          pt: 2,
          mb: 3,
          minHeight: 500,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1px solid',
          borderColor: 'rgba(194,201,209,.15)',
          borderRadius: 10,
        }}
      >
        <Flex
          sx={{
            alignItems: ['flex-start', 'flex-start', 'center-start'],
            flexDirection: ['column', 'column', 'row'],
            justifyContent: 'space-between',
            pt: '6px',
            px: 22,
            pb: 3,
          }}
        >
          <Box sx={{ mb: [2, 2, 0] }}>
            <Flex sx={{ alignItems: 'center' }}>
              <Box
                onClick={() => {
                  setOrchestratorTable('staking')
                  router.push('/')
                }}
                sx={{
                  fontSize: 0,
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'rgba(255,255,255,.1)',
                  bg: performanceViewActive
                    ? 'transparent'
                    : 'rgba(255,255,255,.1)',
                  py: '6px',
                  px: 1,
                  mr: 1,
                }}
              >
                Staking
              </Box>
              <Box
                onClick={() => {
                  setOrchestratorTable('performance')
                  router.push('?orchestratorTable=performance')
                }}
                sx={{
                  fontSize: 0,
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'rgba(255,255,255,.1)',
                  bg: performanceViewActive
                    ? 'rgba(255,255,255,.1)'
                    : 'transparent',
                  py: '6px',
                  px: 1,
                }}
              >
                Performance
              </Box>
            </Flex>
          </Box>

          {performanceViewActive && (
            <Flex sx={{ alignItems: 'center' }}>
              <Flex sx={{ alignItems: 'center' }}>
                <Box
                  sx={{
                    color: 'rgba(255,255,255,.5)',
                    fontSize: 1,
                    mr: 1,
                  }}
                >
                  Select Region:
                </Box>
                <Flex
                  ref={targetRef}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsRegionSelectorOpen(true)
                  }}
                  sx={{
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: 1,
                    cursor: 'pointer',
                    borderBottom: '1px dashed rgba(255,255,255,.5)',
                  }}
                >
                  <span sx={{ mr: '8px' }}>{regions[region]}</span>
                  <span
                    sx={{
                      width: '0',
                      height: '0',
                      borderStyle: 'solid',
                      borderWidth: '5px 4px 0 4px',
                      borderColor:
                        '#ffffff transparent transparent transparent',
                    }}
                  />
                </Flex>
                <Menu
                  style={{
                    background: '#1E2026',
                    padding: 0,
                    borderRadius: 10,
                    zIndex: 10,
                    boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
                  }}
                  isOpen={isRegionSelectorOpen}
                  onClose={() => setIsRegionSelectorOpen(false)}
                  buttonRef={targetRef}
                >
                  <MenuItemRadioGroup
                    value={region}
                    onChange={(value) => {
                      setRegion(value)
                    }}
                  >
                    <MenuItemRadio value="global" label="Global" />
                    <MenuItemRadio value="sin" label="Asia (Singapore)" />
                    <MenuItemRadio value="fra" label="Europe (Frankfurt)" />
                    <MenuItemRadio
                      value="mdw"
                      label="North America (Chicago)"
                    />
                  </MenuItemRadioGroup>
                </Menu>
              </Flex>
              <Box sx={{ ml: 3 }}>
                <TimeframeToggle
                  refetch={refetch}
                  timeframe={timeframe}
                  setTimeframe={setTimeframe}
                />
              </Box>
            </Flex>
          )}
        </Flex>

        {/* Show loading indicator if this is the first time time fetching or we're refetching
        https://github.com/apollographql/apollo-client/blob/main/src/core/networkStatus.ts */}
        {!data ||
        networkStatus === NetworkStatus.loading ||
        networkStatus === NetworkStatus.refetch ? (
          <Box
            sx={{
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
              top: 'calc(50%)',
              left: '50%',
              height: '500px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Spinner />
          </Box>
        ) : (
          <Box>
            {performanceViewActive ? (
              <PerformanceTable
                pageSize={pageSize}
                data={{
                  currentRound: data.protocol.currentRound,
                  transcoders: data.transcoders,
                }}
                region={region}
              />
            ) : (
              <StakingTable
                pageSize={pageSize}
                data={{
                  currentRound: data.protocol.currentRound,
                  transcoders: data.transcoders,
                }}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Index
