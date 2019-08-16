import React from 'react'
import { Global } from '@emotion/core'

const Reset = () =>
  React.createElement(Global, {
    styles: {
      '*': {
        boxSizing: 'border-box'
      },
      body: {
        margin: '0',
      },
      'h1, h2, h3, h4, h5, h6': {
        margin: 0,
      },
      small: {
        fontSize: '100%',
      },
      a: {
        textDecoration: 'none',
      },
      button: {
        border: 0,
        padding: 0,
        fontSize: '100%',
        backgroundColor: 'transparent',
      },
      '.MuiPaper-root div:nth-of-type(2)': {
        overflow: 'initial !important'
      },
      '.MuiPaper-root div:nth-of-type(2) > div > div': {
        overflow: 'initial !important'
      }
    },
  })

  export default Reset