/** @jsx jsx */
import React from 'react'
import { Styled, jsx, Flex, Box } from 'theme-ui'
import Trending from '../../../static/img/trending.svg'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

export default () => {
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
        Projected Rewards
        <Trending sx={{ width: 16, height: 16, ml: 1, color: 'primary' }} />
      </Styled.h4>
      <Box sx={{ px: 2, py: 3, mb: 4 }}>
        <Box>
          <Flex sx={{ fontSize: 0, mb: 1, justifyContent: 'space-between' }}>
            <div sx={{ fontWeight: 500 }}>Annual</div>
            <div sx={{ fontFamily: 'monospace', color: 'muted' }}>
              {data.principle
                ? ((data.roi / data.principle) * 100).toFixed(2) + '%'
                : 0 + '%'}
            </div>
          </Flex>
          <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Styled.h2 as="div" sx={{ fontFamily: 'monospace' }}>
              {abbreviateNumber(parseFloat(data.roi).toFixed(2))}
              <Styled.h6 as="span" sx={{ ml: 1 }}>
                LPT
              </Styled.h6>
            </Styled.h2>
            <Styled.h2 as="div" sx={{ fontFamily: 'monospace' }}>
              ${abbreviateNumber((parseFloat(data.roi) * 6.3).toFixed(2))}
            </Styled.h2>
          </Flex>
        </Box>
      </Box>
    </div>
  )
}

function abbreviateNumber(value) {
  let newValue = value
  const suffixes = ['', 'K', 'M', 'B', 'T']
  let suffixNum = 0
  while (newValue >= 1000) {
    newValue /= 1000
    suffixNum++
  }

  newValue = Number.parseFloat(newValue).toPrecision(3)

  newValue += suffixes[suffixNum]
  return newValue
}
