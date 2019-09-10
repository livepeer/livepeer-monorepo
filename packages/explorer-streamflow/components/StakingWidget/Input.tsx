/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useApolloClient } from '@apollo/react-hooks'
import * as Utils from 'web3-utils'

let hoursPerYear = 8760
let averageHoursPerRound = 21
let roundsPerYear = hoursPerYear / averageHoursPerRound

export default ({ value, protocol, ...props }) => {
  const client = useApolloClient()
  const totalSupply = Number(Utils.fromWei(protocol.totalTokenSupply))
  const totalStaked = Number(Utils.fromWei(protocol.totalBondedToken))

  let roi: number = 0
  let principle: number
  principle = parseFloat(value) ? parseFloat(value) : 0
  roi = calculateAnnualROI({
    principle,
    totalSupply,
    totalStaked,
  })
  client.writeData({
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
        mb: 3,
        position: 'relative',
      }}
      {...props}
    >
      <input
        placeholder="0"
        type="number"
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
            WebkitAppearance: 'none',
          },
          '&::-webkit-outer-spin-button': {
            WebkitAppearance: 'none',
          },
        }}
      />
      <div sx={{ fontWeight: 'bold', right: 0, position: 'absolute' }}>LPT</div>
    </div>
  )
}

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
