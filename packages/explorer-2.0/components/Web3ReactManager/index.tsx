import { useInactiveListener, useEagerConnect } from '../../hooks'

const Index = ({ children }) => {
  const triedEager = useEagerConnect()

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  return children
}

export default Index
