import 'babel-polyfill'
import 'url-search-params-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { injectGlobal } from 'styled-components'
import gql from 'graphql-tag'
import createApolloClient from '@livepeer/apollo'
import Root from './components/Root'
import App from './components/App'
import { unregister } from './registerServiceWorker'
import { sleep } from './utils'
import { CTA } from './components'
const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'
const hot = module.hot && isDev
const trackingId = process.env.REACT_APP_GA_TRACKING_ID
;(async () => {
  // dump global styles
  injectGlobal`
    :root {
      --black: #000000;
      --white: #ffffff;
      --green: #00eb87;
      --tan: #faf5ef;
      --grey: #cfcfcf;
      --red: #f00;
      --primary: var(--green);
      --error: var(--red);
      --bg-dark: var(--black);
      --bg-light: var(--tan);
      --mdc-theme-primary: var(--green);
      --mdc-theme-secondary: var(--black);
    }
    @font-face {
      font-family: 'AkkuratMonoPro';
      src: url('/static/fonts/lineto-akkuratmono-pro-regular.eot');
      src: url('/static/fonts/lineto-akkuratmono-pro-regular.eot?#iefix')
          format('embedded-opentype'),
        url('/static/fonts/lineto-akkuratmono-pro-regular.woff2') format('woff2'),
        url('/static/fonts/lineto-akkuratmono-pro-regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }
    * {
      box-sizing: border-box;
      font-weight: 300;
      // font-family: 'AkkuratMonoPro';
    }
    strong, b {
      font-weight: 500;
    }
    html, body {
      margin: 0;
      font-family: 'Helvetica Neue', helvetica, arial, sans-serif;
      background: var(--bg-light);
    }
    a { color: #03a678; }
    p, ul {
      line-height: 1.5
    }
    select {
      appearance: none;
      background: none;
      padding: 8px;
      padding-right: 40px;
      font-size: 14px;
      border-radius: 0;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      outline: none;
      border: 0;
      color: #000;
      background-color: #fff;
      background-image:
        linear-gradient(45deg, transparent 50%, #000 50%),
        linear-gradient(135deg, #000 50%, transparent 50%);
      background-position:
        calc(100% - 20px) calc(1em + 1px),
        calc(100% - 15px) calc(1em + 1px);
      background-size:
        5px 5px,
        5px 5px;
      background-repeat: no-repeat;
    }
    .tooltip-medium {
      max-width: 150px;
      white-space: normal;
      word-wrap: break-word;
      padding: 8px 16px;
    }
    .tooltip-nowrap {
      padding: 8px 16px;
    }
    #header-root {
      position: fixed;
      width: 100%;
      z-index: 1;
    }
    #main-root {
      padding-top: 64px;
    }
    #modal-root {
      z-index: 1;
      position: relative;
    }
    .mdc-text-field__input {
      font-size: 16px;
      margin-top: 11px;
    }
    .joyride-beacon span:nth-child(1) {
      background-color: var(--primary) !important;
    }
    .joyride-beacon span:nth-child(2) {
      background-color: rgba(0, 235, 135, .2) !important;
      border: 2px solid var(--primary) !important;
    }
    .__floater__body div div:nth-child(2) {
      justify-content: flex-end !important;
      button {
        display: inline-flex !important;
        align-items: center !important;
        padding: 8px 12px !important;
        margin: 8px !important;
        background-image: none !important !important;
        text-transform: uppercase !important;
        letter-spacing: 2px !important;
        font-size: 12px !important;
        outline: none !important;
        border: none !important;
        border-radius: 0 !important;
        cursor: pointer !important;
        background: none !important;
        color: #000 !important;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.35) !important;
      }
    }
  `
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
  // bootstrap the apollo client
  const client = await createApolloClient(async () => {
    const opts = {
      // Allow builds to configure the http provider
      provider: process.env.REACT_APP_HTTP_PROVIDER,
      // Default gas limit to send with transactions (2.1m wei)
      defaultGas: 2.1 * 1000000,
      // Etherscan API Key
      etherscanApiKey: process.env.REACT_APP_ETHERSCAN_API_KEY,
      // If user account changes while on /me, this will hard refresh the page
      onAccountChange: (currentAccount: string, nextAccount: string): void => {
        const path = window.location.pathname.toLowerCase()
        const onMyAccountPage = path.includes(`/accounts/${currentAccount}`)
        const accountChanged = nextAccount !== currentAccount
        if (onMyAccountPage && accountChanged) window.location = '/me'
      },
    }
    // The address of the deployed Controller contract
    // Test if web3 is injected
    // For Mist compatability we also check if the web3 object has the `version` property
    // because at the moment the Mist provided web3 object does not have additional properties like `version`
    // As a result, if a web3 object with the `version` property is not available, we fallback
    // to using a default provider which should be the case when using Mist
    if (window.ethereum) {
      // this is the new metamask way. details: https://bit.ly/2QQHXvF
      window.web3 = new window.Web3(window.ethereum)
      try {
        await window.ethereum.enable()
      } catch (e) {
        console.log('METAMASK Rejected domain')
        throw e
      }
    } else if (window.web3 && window.web3.version) {
      // this is the old way, accounts are always exposed.
    }

    const { version } = window.web3
    const controllers = {
      1: process.env.REACT_APP_MAINNET_CONTROLLER_ADDRESS,
      4: process.env.REACT_APP_RINKEBY_CONTROLLER_ADDRESS,
    }
    while (version.network === null) {
      console.log('waiting on web3 network version...')
      await sleep(100)
    }
    opts.controllerAddress =
      controllers[version.network] || process.env.REACT_APP_CONTROLLER_ADDRESS

    console.info('new metamask beta....., version: ', version)

    return opts
  })

  const update = () =>
    render(
      <Root client={client}>
        <App />
      </Root>,
      document.getElementById('main-root'),
    )

  update()

  // Analytics
  if (isProd && trackingId) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    document.body.appendChild(script)
    script.onload = () => {
      window.dataLayer = window.dataLayer || []
      window.gtag = function() {
        window.dataLayer.push(arguments)
      }
      window.gtag('js', new Date())
      window.gtag('config', trackingId)
    }
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
  }

  if (hot) module.hot.accept(update)
})()

unregister()
