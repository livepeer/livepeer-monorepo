/** @jsx jsx */
import { useEffect, useState } from 'react'
import { jsx, Flex } from 'theme-ui'
import Layout from '../components/Layout'
import Thumbnail from '../components/Thumbnail'
import { GoogleLogin, GoogleLogout } from 'react-google-login'

const responseGoogle = response => {
  // TODO: use a context/state hook wrapper around fetch, to pull data out of the context for requests
  const googleAuthToken = response.getAuthResponse().id_token
  localStorage.setItem('googleAuthToken', googleAuthToken)
}

const logout = () => {
  localStorage.removeItem('googleAuthToken')
  console.log('User signed out.')
}

export default () => {
  const [clientId, setClientId] = useState(null)

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/google-client')
      if (res.status !== 200) {
        return console.error('fetch failed ' + (await res.text()))
      }
      const data = await res.json()

      setClientId(data.clientId)
    })()
  }, [])

  if (clientId === null) {
    // TODO: render loading spinning wheel
    return (
      <Layout>
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'space-around',
          }}
        >
          Loading...
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout>
      <Flex
        sx={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'space-around',
        }}
      >
        <GoogleLogin
          sx={{ flexGrow: '0', height: '50px' }}
          clientId={clientId}
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
        <GoogleLogout
          clientId={clientId}
          buttonText="Logout"
          onLogoutSuccess={logout}
        />
      </Flex>
    </Layout>
  )
  // return (
  //   <Layout>
  //     <Flex>Loaded!</Flex>
  //   </Layout>
  // );
}
