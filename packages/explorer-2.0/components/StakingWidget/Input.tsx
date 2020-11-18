import { gql, useApolloClient } from '@apollo/client'
import Utils from 'web3-utils'
import useWindowSize from 'react-use/lib/useWindowSize'

let hoursPerYear = 8760
let averageHoursPerRound = 21
let roundsPerYear = hoursPerYear / averageHoursPerRound

const Input = ({ transcoder, value = '', onChange, protocol, ...props }) => {
  const client = useApolloClient()
  const { width } = useWindowSize()
  const totalSupply = Number(Utils.fromWei(protocol.totalTokenSupply))
  const totalStaked = Number(Utils.fromWei(protocol.totalActiveStake))
  const rewardCut =
    transcoder?.rewardCut > 0 ? transcoder?.rewardCut / 1000000 : 0
  const inflation = protocol.inflation > 0 ? protocol.inflation / 1000000000 : 0
  const inflationChange =
    protocol.inflationChange > 0 ? protocol.inflationChange / 1000000000 : 0
  let roi: number = 0
  let principle: number
  principle = parseFloat(value) ? parseFloat(value) : 0
  roi = calculateAnnualROI({
    inflation,
    inflationChange,
    rewardCut,
    principle,
    totalSupply,
    totalStaked,
  })
  client.writeQuery({
    query: gql`
      query {
        principle
        roi
      }
    `,
    data: {
      principle,
      roi,
    },
  })
  return (
    <div
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
      }}
      {...props}
    >
      <input
        placeholder="0.0"
        type="number"
        autoFocus={width > 1020}
        value={value}
        onChange={onChange}
        sx={{
          backgroundColor: 'transparent',
          borderTop: 0,
          borderLeft: 0,
          borderRight: 0,
          borderBottom: 0,
          color: 'text',
          py: 0,
          pl: 0,
          pr: 6,
          boxShadow: 'none',
          width: '100%',
          outline: 'none',
          fontSize: 4,
          fontFamily: 'monospace',
          '&::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
          },
          '&::-webkit-outer-spin-button': {
            WebkitAppearance: 'none',
          },
        }}
      />
      <div sx={{ fontSize: 1, right: 0, position: 'absolute' }}>LPT</div>
    </div>
  )
}

export default Input

function calculateAnnualROI({
  rewardCut,
  inflation,
  inflationChange,
  principle,
  totalSupply,
  totalStaked,
}) {
  let totalRewardTokens = 0
  let roi = 0
  let percentOfTotalStaked = principle / totalStaked
  let participationRate = totalStaked / totalSupply
  let totalRewardTokensMinusFee: number
  let currentMintableTokens: number

  for (let i = 0; i < roundsPerYear; i++) {
    if (inflation < 0) break
    currentMintableTokens = totalSupply * inflation
    totalRewardTokens = percentOfTotalStaked * currentMintableTokens
    totalRewardTokensMinusFee =
      totalRewardTokens - totalRewardTokens * rewardCut
    roi = roi + totalRewardTokensMinusFee
    totalSupply = totalSupply + currentMintableTokens
    inflation =
      participationRate > 0.5
        ? inflation - inflationChange
        : inflation + inflationChange
  }

  return roi ? roi : 0
}
