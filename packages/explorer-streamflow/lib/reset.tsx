import React from 'react'
import { Global } from '@emotion/core'

const Reset = () =>
  React.createElement(Global, {
    styles: {
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
    },
  })

  export default Reset