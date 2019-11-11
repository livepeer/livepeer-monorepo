/** @jsx jsx */
import React, { useEffect, useState } from 'react'
import { jsx, Flex } from 'theme-ui'
import Play from '../../static/img/play.svg'
import { useWeb3Context } from 'web3-react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { useCountUp } from 'react-countup'
import { css, keyframes } from '@emotion/core'

const pop = keyframes`
  50%  {transform: scale(1.2);}
`

const GET_ROUND = gql`
  {
    currentRound: rounds(first: 1, orderBy: timestamp, orderDirection: desc) {
      id
    }
  }
`

export default () => {
  const context = useWeb3Context()
  let { data, loading } = useQuery(GET_ROUND, {
    pollInterval: 10000,
    ssr: true,
  })

  if (loading) {
    return null
  }

  let [popped, setPopped] = useState(false)
  let { countUp } = useCountUp({
    duration: 1,
    onEnd: () => setPopped(true),
    end: data.currentRound[0].id,
  })

  return (
    <Flex
      sx={{
        py: 1,
        px: 2,
        fontSize: 0,
        fontWeight: 600,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'surface',
        borderRadius: 5,
        // border: '1px solid',
        // borderColor: 'border',
        // cursor: 'pointer',
        // transition: '.2s box-shadow',
        // ':hover': {
        //   transition: '.2s box-shadow',
        //   boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
        // },
      }}
    >
      <Flex
        sx={{ alignItems: 'center', fontFamily: 'monospace', color: 'primary' }}
      >
        <Play sx={{ width: 10, height: 10, mr: 1 }} />
        {context.networkId
          ? context.networkId == 1
            ? 'Mainnet'
            : 'Rinkeby'
          : 'Mainnet'}
      </Flex>
      <div sx={{ height: 16, mx: 1, backgroundColor: 'border', width: 1 }} />
      <div sx={{ fontFamily: 'monospace' }}>
        Round{' '}
        <div
          css={css`
            animation: ${popped ? pop : ''} 0.3s linear 1;
          `}
          sx={{ display: 'inline-flex', fontFamily: 'monospace' }}
        >
          #{countUp}
        </div>
      </div>
    </Flex>
  )
}
