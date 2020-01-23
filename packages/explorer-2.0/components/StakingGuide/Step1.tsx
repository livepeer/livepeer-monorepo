import { Styled } from 'theme-ui'
import Router from 'next/router'

export default ({ goTo, nextStep }) => {
  Router.events.on('routeChangeComplete', url => {
    if (url == '/connect-wallet') goTo(nextStep)
  })
  return (
    <div>
      <Styled.h2 sx={{ mb: 2 }}>Connect Wallet</Styled.h2>
      <Styled.p>First things first. Let's connect your wallet.</Styled.p>
    </div>
  )
}
