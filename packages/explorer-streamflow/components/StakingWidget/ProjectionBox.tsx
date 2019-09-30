/** @jsx jsx */
import React from 'react'
import { Styled, jsx, Flex, Box } from 'theme-ui'
import Trending from '../../static/img/trending.svg'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { abbreviateNumber } from '../../lib/utils'

export default ({ action }) => {
  const GET_ROI = gql`
    {
      roi @client
      principle @client
    }
  `

  const { data } = useQuery(GET_ROI)

  return (
    <div
      sx={{
        borderRadius: 5,
        width: '100%',
        bg: 'background',
        mb: 3,
      }}
    >
      <Styled.h4
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'border',
          fontSize: 2,
          justifyContent: 'space-between',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold',
        }}
      >
        {action == 'stake' ? 'Projected Rewards' : 'Projected Opportunity Cost'}
        {action == 'stake' && (
          <Trending sx={{ width: 16, height: 16, ml: 1, color: 'primary' }} />
        )}
      </Styled.h4>
      <Box sx={{ px: 2, py: 3, mb: 4 }}>
        <Box>
          <Flex sx={{ fontSize: 0, mb: 1, justifyContent: 'space-between' }}>
            <div sx={{ fontWeight: 500 }}>12 Months</div>
            <div sx={{ fontFamily: 'monospace', color: 'muted' }}>
              +
              {data.principle
                ? ((data.roi / data.principle) * 100).toFixed(2) + '%'
                : 0 + '%'}
            </div>
          </Flex>
          <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div sx={{ fontSize: 4, fontFamily: 'monospace' }}>
              +{abbreviateNumber(data.roi)}
            </div>
            <div sx={{ fontSize: 1 }}>LPT</div>
          </Flex>
        </Box>
      </Box>
    </div>
  )
}
