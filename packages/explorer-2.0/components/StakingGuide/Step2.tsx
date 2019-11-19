/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import Router from 'next/router'

export default ({ goTo, nextStep }) => {
  Router.events.on('routeChangeComplete', url => {
    if (url == '/connect-wallet?connected=true') goTo(nextStep)
  })
  return (
    <div>
      <Styled.h2 sx={{ mb: 2 }}>Choose Provider</Styled.h2>
      <Styled.p>
        Select your preferred wallet. You can change your selected wallet or
        address later.
      </Styled.p>
    </div>
  )
}
