import { Box } from 'theme-ui'
import Utils from 'web3-utils'

export default ({ value, per, useEthSymbol = true }) => {
  if (per === '1m pixels') {
    return (
      <Box sx={{ fontFamily: 'monospace' }}>
        {parseFloat(
          Utils.fromWei(Math.round(value * 1000000).toString(), 'gwei'),
        ).toLocaleString()}
        <span sx={{ ml: 1, fontSize: 12 }}>GWEI</span>
      </Box>
    )
  } else if (per === '1b pixels') {
    return (
      <Box sx={{ fontFamily: 'monospace' }}>
        {parseFloat(
          Utils.fromWei(Math.round(value * 1000000000).toString(), 'gwei'),
        ).toLocaleString()}
        <span sx={{ ml: 1, fontSize: 12 }}>GWEI</span>
      </Box>
    )
  } else if (per === '1t pixels') {
    return (
      <Box sx={{ fontFamily: 'monospace' }}>
        {parseFloat(
          Utils.fromWei(Math.round(value * 1000000000000).toString()),
        )}
        <span sx={{ ml: 1, fontSize: 12 }}>{useEthSymbol ? 'Ξ' : 'ETH'}</span>
      </Box>
    )
  } else {
    return (
      <Box sx={{ fontFamily: 'monospace' }}>
        {value.toLocaleString()}
        <span sx={{ ml: 1, fontSize: 12 }}>WEI</span>
      </Box>
    )
  }
}
