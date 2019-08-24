/** @jsx jsx */
import { Styled, jsx, Flex, Box } from 'theme-ui'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
import Button from '../Button'
import QRCode from 'qrcode.react'
import gql from 'graphql-tag'
import Utils from 'web3-utils'
import React from 'react'
import { useWeb3Context, Web3Consumer } from 'web3-react'
import Trending from '../../static/img/trending.svg'
import { ethers } from 'ethers'

let hoursPerYear = 8760
let averageHoursPerRound = 21
let roundsPerYear = hoursPerYear / averageHoursPerRound

const BOND = gql`
  mutation bond($to: String!, $amount: String!) {
    bond(to: $to, amount: $amount)
  }
`

const APPROVE = gql`
  mutation approve($type: String!, $amount: String!) {
    approve(type: $type, amount: $amount)
  }
`

function calculateAnnualROI({ principle, totalSupply, totalStaked }) {
  let orchestratorRewardCut = 0.01
  let inflationDelta = 0.000003
  let inflationRate = 0.001544
  let totalRewardTokens = 0
  let roi = 0
  let percentOfTotalStaked = principle / totalStaked
  let participationRate = totalStaked / totalSupply
  let totalRewardTokensMinusFee: number
  let currentMintableTokens: number

  for (let i = 0; i < roundsPerYear; i++) {
    if (inflationRate < 0) break
    currentMintableTokens = totalSupply * inflationRate
    totalRewardTokens = percentOfTotalStaked * currentMintableTokens
    totalRewardTokensMinusFee =
      totalRewardTokens - totalRewardTokens * orchestratorRewardCut
    roi = roi + totalRewardTokensMinusFee
    totalSupply = totalSupply + currentMintableTokens
    inflationRate =
      participationRate > 0.5
        ? inflationRate - inflationDelta
        : inflationRate + inflationDelta
  }
  return roi
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

const Row = ({ label, percentChange, symbol, earnings, ...props }) => (
  <Box {...props}>
    <Flex sx={{ fontSize: 0, mb: 1, justifyContent: 'space-between' }}>
      <Styled.div sx={{ fontWeight: 500 }}>{label}</Styled.div>
      <Styled.div sx={{ fontFamily: 'monospace', color: 'muted' }}>
        {percentChange}
      </Styled.div>
    </Flex>
    <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Styled.h2 as="div" sx={{ fontFamily: 'monospace' }}>
        {abbreviateNumber(earnings)}
        <Styled.h6 as="span" sx={{ ml: 1 }}>
          {symbol}
        </Styled.h6>
      </Styled.h2>
      <Styled.h2 as="div" sx={{ fontFamily: 'monospace' }}>
        ${abbreviateNumber((earnings * 6.3).toFixed(2))}
      </Styled.h2>
    </Flex>
  </Box>
)

const Input = ({ variant = 'primary', ...props }) => (
  <Styled.div
    sx={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      mb: 3,
      position: 'relative'
    }}>
    <Styled.div
      as="input"
      {...props}
      sx={{
        backgroundColor: 'transparent',
        borderTop: '0',
        borderLeft: '0',
        borderRight: '0',
        borderBottom: '1px solid',
        borderColor: 'muted',
        p: 1,
        color: 'text',
        boxShadow: 'none',
        width: '100%',
        outline: 'none',
        fontSize: 26,
        fontFamily: 'monospace',
        '&::-webkit-inner-spin-button': {
          WebkitAppearance: 'none'
        },
        '&::-webkit-outer-spin-button': {
          WebkitAppearance: 'none'
        }
      }}
    />
    <Styled.div sx={{ fontWeight: 'bold', right: 0, position: 'absolute' }}>
      LPT
    </Styled.div>
  </Styled.div>
)

export default ({ protocol }) => {
  const client = useApolloClient()
  const GET_ROI = gql`
    {
      roi @client
      principle @client
    }
  `

  const { data } = useQuery(GET_ROI)
  const context = useWeb3Context()

  const [approve, { error, data: bondData }] = useMutation(APPROVE, {
    variables: {
      type: 'bond',
      amount: Utils.toWei('1', 'ether')
    },
    context: {
      provider: (window as any).web3.currentProvider,
      account: context.account ? context.account.toLowerCase() : ''
    }
  })

  if (error) {
    console.error(error)
  }

  const totalSupply = Number(Utils.fromWei(protocol.totalTokenSupply))
  const totalStaked = Number(Utils.fromWei(protocol.totalBondedToken))

  let roi: number = 0
  let principle: number

  return (
    <Flex
      sx={{
        position: 'sticky',
        alignSelf: 'flex-start',
        top: 4,
        width: '30%'
      }}>
      <Box
        sx={{
          width: '100%',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: 5,
          backgroundColor: '#1E2026'
        }}>
        <Styled.h4
          as="h3"
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'border',
            fontWeight: 'bold',
            fontSize: 20
          }}>
          <QRCode
            style={{
              borderRadius: 1000,
              width: 44,
              height: 44,
              marginRight: 16
            }}
            fgColor={`#${'0x58b6a8a3302369daec383334672404ee733ab239'.substr(
              2,
              6
            )}`}
            value={'0x58b6a8a3302369daec383334672404ee733ab239'}
          />
          <Flex sx={{ flexDirection: 'column' }}>
            <Styled.div>Staked</Styled.div>
            <Styled.div
              sx={{
                fontWeight: 'normal',
                color: 'muted',
                fontSize: 1,
                lineHeight: 1.5,
                textTransform: 'initial'
              }}>
              0xe9e...28427
            </Styled.div>
          </Flex>
        </Styled.h4>
        <Styled.div sx={{ p: 2 }}>
          <Styled.div
            sx={{
              borderRadius: 5,
              width: '100%',
              bg: 'background',
              mb: 3
            }}>
            <Styled.h4
              sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'border',
                fontSize: 2,
                justifyContent: 'space-between',
                display: 'flex',
                alignItems: 'center',
                // textTransform: 'uppercase',
                fontWeight: 'bold'
              }}>
              Projected ROI
              <Trending
                sx={{ width: 16, height: 16, ml: 1, color: 'primary' }}
              />
            </Styled.h4>
            {/* Compounding Interval is 1 round */}
            <Box sx={{ px: 2, py: 3, mb: 4 }}>
              <Row
                label="Annual"
                earnings={parseFloat(data.roi).toFixed(2)}
                symbol="LPT"
                percentChange={
                  data.principle
                    ? ((data.roi / data.principle) * 100).toFixed(2) + '%'
                    : 0 + '%'
                }
              />
            </Box>
          </Styled.div>
          <Input
            placeholder="0"
            type="number"
            onChange={e => {
              principle = parseFloat(e.target.value)
                ? parseFloat(e.target.value)
                : 0
              roi = calculateAnnualROI({
                principle,
                totalSupply,
                totalStaked
              })
              client.writeData({
                data: {
                  principle,
                  roi
                }
              })
            }}
          />
          <Button onClick={() => approve()} sx={{ width: '100%' }}>
            Bond
          </Button>
        </Styled.div>
      </Box>
    </Flex>
  )
}
