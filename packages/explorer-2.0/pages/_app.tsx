import App from 'next/app'
import Head from 'next/head'
import { ThemeProvider, ColorMode } from 'theme-ui'
import theme from '../lib/theme'
import connectors from '../lib/connectors'
import Web3Provider from 'web3-react'
import { ethers } from 'ethers'
import { CookiesProvider } from 'react-cookie'
import Web3 from 'web3'

class MyApp extends App {
  render() {
    const { Component, pageProps }: any = this.props

    return (
      <>
        <Head>
          <title>Tokenholder App</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500&display=swap"
            rel="stylesheet"
          />
          {/* <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" /> */}
        </Head>

        <ThemeProvider theme={theme}>
          <ColorMode />
          <Web3Provider
            connectors={connectors}
            libraryName={'web3.js'}
            web3Api={Web3}
          >
            <CookiesProvider>
              <Component {...pageProps} />
            </CookiesProvider>
          </Web3Provider>
        </ThemeProvider>
      </>
    )
  }
}

export default MyApp
