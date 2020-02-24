import App from 'next/app'
import Head from 'next/head'
import { ThemeProvider, ColorMode } from 'theme-ui'
import theme from '../lib/theme'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { CookiesProvider } from 'react-cookie'
import '@reach/dialog/styles.css'
import Web3ReactManager from '../components/Web3ReactManager'
import ReactGA from 'react-ga'
import { isMobile } from 'react-device-detect'

function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 10000
  return library
}

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize(process.env.GA_TRACKING_ID)
  ReactGA.set({
    customBrowserType: !isMobile
      ? 'desktop'
      : window['web3'] || window['ethereum']
      ? 'mobileWeb3'
      : 'mobileRegular',
  })
} else {
  ReactGA.initialize('test', { testMode: true })
}

class MyApp extends App {
  render() {
    const { Component, pageProps }: any = this.props

    return (
      <>
        <Head>
          <title>Livepeer Explorer</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500&display=swap"
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
}

export default MyApp
