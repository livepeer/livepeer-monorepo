import Head from 'next/head'
import { ThemeProvider, ColorMode } from 'theme-ui'
import theme from '../lib/theme'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { CookiesProvider } from 'react-cookie'
import Web3ReactManager from '../components/Web3ReactManager'
import 'react-circular-progressbar/dist/styles.css'
import '@reach/dialog/styles.css'

function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 10000
  return library
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Livepeer Explorer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700"
          rel="stylesheet"
        />
      </Head>

      <ThemeProvider theme={theme}>
        <ColorMode />
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ReactManager>
            <CookiesProvider>
              <Component {...pageProps} />
            </CookiesProvider>
          </Web3ReactManager>
        </Web3ReactProvider>
      </ThemeProvider>
    </>
  )
}

export default MyApp
