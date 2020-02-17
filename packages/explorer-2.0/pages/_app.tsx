import App from 'next/app'
import Head from 'next/head'
import { ThemeProvider, ColorMode } from 'theme-ui'
import theme from '../lib/theme'
import { Injected, Network, Portis } from '../lib/connectors'
import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError,
} from '@web3-react/core'
import { ethers } from 'ethers'
import { CookiesProvider } from 'react-cookie'
import Web3 from 'web3'
import '@reach/dialog/styles.css'

function getLibrary(provider) {
  return new Web3(provider)
}

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
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${process.env.GA_TRACKING_ID}');`,
            }}
          />
        </Head>

        <ThemeProvider theme={theme}>
          <ColorMode />
          <Web3ReactProvider getLibrary={getLibrary}>
            <CookiesProvider>
              <Component {...pageProps} />
            </CookiesProvider>
          </Web3ReactProvider>
        </ThemeProvider>
      </>
    )
  }
}

export default MyApp
