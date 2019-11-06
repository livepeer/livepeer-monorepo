import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import { ThemeProvider, ColorMode } from 'theme-ui'
import theme from '../lib/theme'
import connectors from '../lib/connectors'
import Web3Provider from 'web3-react'
import { ethers } from 'ethers'
import { CookiesProvider } from 'react-cookie'
import Web3 from 'web3'
import Layout from '../layouts/main'
import { withApollo } from '../lib/apollo'

class MyApp extends App {
  render() {
    const { Component, pageProps }: any = this.props
    const getLayout =
      Component.getLayout || (page => <Layout children={page} />)

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
          <Web3Provider
            connectors={connectors}
            libraryName={'web3.js'}
            web3Api={Web3}
          >
            <CookiesProvider>
              {getLayout(<Component {...pageProps} />)}
            </CookiesProvider>
          </Web3Provider>
        </ThemeProvider>
      </>
    )
  }
}

export default withApollo(MyApp)
