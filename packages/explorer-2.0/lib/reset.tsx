import React from 'react'
import { Global } from '@emotion/core'
import theme from './theme'

const Reset = () =>
  React.createElement(Global, {
    styles: {
      '*': {
        boxSizing: 'border-box',
        fontFamily: theme.fonts.body,
        outline: 'none',
        lineHeight: 1.5,
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
        paddingLeft: 20,
      },
      button: {
        border: 0,
        padding: 0,
        fontSize: '100%',
        backgroundColor: 'transparent',
      },
      '.MuiPaper-root div:nth-of-type(2)': {
        overflow: 'initial !important',
      },
      '.MuiPaper-root div:nth-of-type(2) > div > div': {
        overflow: 'initial !important',
      },
      ':root': {
        '--reach-dialog': 1,
      },
      '[data-reach-dialog-overlay]': {
        background: 'hsla(0, 0%, 0%, 0.33)',
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        overflow: 'auto',
        zIndex: 1000,
      },
      '[data-reach-dialog-content]': {
        margin: '10vh auto',
        width: '90vw',
        maxHeight: '90vh',
        overflow: 'scroll',
        padding: 0,
        backgroundColor: `${theme.colors.surface} !important`,
        outline: 'none',
        borderRadius: '10px',
        '@media (min-width: 672px)': {
          width: '65vw',
        },
        '@media (min-width: 1020px)': {
          maxWidth: 650,
        },
      },
      '.tooltip': {
        boxShadow: '0px 4px 4px rgba(0,0,0,0.15)',
        backgroundColor: `${theme.colors.surface} !important`,
        fontWeight: 400,
        color: `${theme.colors.text} !important`,
        maxWidth: 220,
        textTransform: 'initial',
        opacity: '1 !important',
        borderRadius: '6px !important',
      },
      '.MuiStepper-vertical': {
        marginBottom: '-8px',
        padding: '0 !important',
      },
      '.MuiPaper-root': {
        backgroundColor: 'transparent !important',
        color: `${theme.colors.text} !important`,
      },
      '.MuiStepLabel-label': {
        color: `${theme.colors.muted} !important`,
      },
      '.MuiStepLabel-active': {
        color: `${theme.colors.text} !important`,
      },
      '.MuiStepIcon-completed': {
        color: `${theme.colors.primary} !important`,
      },
      '.MuiStepIcon-active': {
        color: `${theme.colors.primary} !important`,
      },
      '.MuiStepIcon-active .MuiStepIcon-text': {
        fill: `${theme.colors.surface} !important`,
      },
      '.MuiStepIcon-text': {
        fontFamily: `${theme.fonts.body} !important`,
      },
    },
  })

export default Reset
