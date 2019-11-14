import React from 'react'
import { Global } from '@emotion/core'
import theme from './theme'

const Reset = () =>
  React.createElement(Global, {
    styles: {
      '*': {
        boxSizing: 'border-box',
        fontFamily: theme.fonts.body,
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
      ul: {
        paddingLeft: 20
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
      },
      ':root': {
        '--reach-dialog': 1,
      },
      '[data-reach-dialog-overlay]': {
        background: 'hsla(0, 0%, 0%, 0.33)',
        position: 'fixed',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        overflow: 'auto',
      },
      '[data-reach-dialog-content]': {
        width: '50vw',
        margin: '10vh auto',
        background: 'white',
        padding: '2rem',
        outline: 'none',
      },
      '.tooltip': {
        backgroundColor: `${theme.colors.surface} !important`,
        fontWeight: 400
      }
    },
  })

  export default Reset