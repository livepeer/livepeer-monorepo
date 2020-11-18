import { NetworkStatus, useQuery } from '@apollo/client'
import { Box, Styled } from 'theme-ui'
import StakingTable from './StakingTable'
import { useEffect } from 'react'
import Spinner from '../Spinner'
import { usePageVisibility } from '../../hooks'
import orchestratorsViewQuery from '../../queries/orchestratorsView.gql'

const Index = () => {
  const isVisible = usePageVisibility()
  const pollInterval = 20000

  const variables = {
    orderBy: 'totalStake',
    orderDirection: 'desc',
    where: {
      status: 'Registered',
    },
  }

  const {
    data,
    networkStatus,
    startPolling: startPollingOrchestrators,
    stopPolling: stopPollingOrchestrators,
  } = useQuery(orchestratorsViewQuery, {
    variables,
    pollInterval,
    notifyOnNetworkStatusChange: true,
  })

  useEffect(() => {
    if (!isVisible) {
      stopPollingOrchestrators()
    } else {
      startPollingOrchestrators(pollInterval)
    }
  }, [isVisible])

  return (
    <Box>
      <Styled.h2 sx={{ fontWeight: 500, fontSize: 18, mb: 2 }}>
        Top Orchestrators
      </Styled.h2>
      <Box
        sx={{
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
        {/* Show loading indicator if this is the first time time fetching or we're refetching
        https://github.com/apollographql/apollo-client/blob/main/src/core/networkStatus.ts */}
        {!data ||
        networkStatus === NetworkStatus.loading ||
        networkStatus === NetworkStatus.refetch ? (
          <Box
            sx={{
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
              top: 'calc(50% + 62px)',
              left: '50%',
            }}
          >
            <Spinner />
          </Box>
        ) : (
          <Box>
            <StakingTable
              data={{
                currentRound: data.protocol.currentRound,
                transcoders: data.transcoders,
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Index
