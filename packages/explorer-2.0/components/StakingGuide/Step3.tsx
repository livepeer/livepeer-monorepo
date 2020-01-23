import { Styled } from 'theme-ui'
import Router from 'next/router'

export default ({ goTo, nextStep }) => {
  Router.events.on('routeChangeComplete', url => {
    if (url.includes('openExchange=true')) {
      goTo(nextStep)
    }
  })
  return (
    <div>
      <Styled.h2 sx={{ mb: 2 }}>Get LPT</Styled.h2>
      <Styled.p>
        You'll need LPT to stake. Let's swap some ETH for LPT on Uniswap.
      </Styled.p>
    </div>
  )
}
