import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import { ThemeProvider, ColorMode } from 'theme-ui'
import theme from '../lib/theme'
import connectors from '../lib/connectors'
import Web3Provider from 'web3-react'
import { ethers } from 'ethers'
import Web3 from 'web3'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>Livepeer Explorer</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <ThemeProvider theme={theme}>
          <ColorMode />
          <Web3Provider
            connectors={connectors}
            libraryName={'web3.js'}
            web3Api={Web3}
          >
            <Component {...pageProps} />
          </Web3Provider>
        </ThemeProvider>
      </>
    )
  }
}

export default MyApp
