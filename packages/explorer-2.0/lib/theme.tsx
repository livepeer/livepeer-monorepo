const heading = {
  color: 'text',
  fontFamily: 'heading',
  lineHeight: 'heading',
  fontWeight: 'heading',
}

const theme = {
  initialColorMode: 'dark',
  space: [0, 8, 16, 24, 32, 40, 48, 56, 64],
  fonts: {
    body:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    heading:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monospace: '"SF Mono", "Roboto Mono", monospace',
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 40, 48, 64, 96],
  fontWeights: {
    body: 400,
    heading: 600,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  breakpoints: ['480px', '672px', '1160px'],
  colors: {
    text: 'rgba(255, 255, 255, .87)',
    background: '#131418',
    primary: '#00EB88',
    secondary: '#FAF5EF',
    surface: '#1E2026',
    muted: '#bdbdbd',
    red: '#d32f2f',
    yellow: '#fbc02d',
    blue: '#0062eb',
    skyBlue: '#5bc2ee',
    teal: '#00bfb2',
    border: 'rgba(255, 255, 255, .16)',
    modes: {},
  },
  buttons: {
    primary: {
      color: 'background',
      bg: 'primary',
    },
    secondary: {
      color: 'text',
      bg: 'transparent',
      border: '1px solid',
      borderColor: 'border',
      transition: 'border-color .2s',
      '&:hover': {
        borderColor: 'text',
        transition: 'border-color .2s',
      },
    },
    outline: {
      color: 'text',
      bg: 'transparent',
      border: '1px solid',
      borderColor: 'text',
      transition: 'border-color .2s',
      '&:hover': {
        borderColor: 'text',
        transition: 'border-color .2s',
      },
    },
    primarySmall: {
      color: 'background',
      bg: 'primary',
      py: '6px',
      px: 2,
    },
    primaryOutlineSmall: {
      bg: 'transparent',
      color: 'primary',
      border: '1px solid',
      borderColor: 'primary',
      fontSize: 0,
      px: 1,
      py: '2px',
    },
    danger: {
      borderRadius: 6,
      cursor: 'pointer',
      backgroundColor: 'rgba(211, 47, 47, .1)',
      transition: '.2s background-color',
      color: 'red',
      '&:hover': {
        transition: '.2s background-color',
        backgroundColor: 'rgba(211, 47, 47, .2)',
      },
    },
    dangerSmall: {
      borderRadius: 6,
      cursor: 'pointer',
      py: '6px',
      px: 2,
      backgroundColor: 'rgba(211, 47, 47, .1)',
      transition: '.2s background-color',
      color: 'red',
      '&:hover': {
        transition: '.2s background-color',
        backgroundColor: 'rgba(211, 47, 47, .2)',
      },
    },
    rainbow: {
      color: 'text',
      background:
        'linear-gradient(260.35deg, #F1BC00 0.25%, #E926BE 47.02%, #9326E9 97.86%)',
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
    },
    h1: {
      ...heading,
      fontSize: 5,
    },
    h2: {
      ...heading,
      fontSize: 4,
    },
    h3: {
      ...heading,
      fontSize: 3,
    },
    h4: {
      ...heading,
      fontSize: 2,
    },
    h5: {
      ...heading,
      fontSize: 1,
    },
    h6: {
      ...heading,
      fontSize: 0,
    },
    p: {
      color: 'text',
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
      margin: '0 0 16px',
    },
    a: {
      color: 'primary',
    },
    pre: {
      fontFamily: 'monospace',
      overflowX: 'auto',
      code: {
        color: 'inherit',
      },
    },
    code: {
      fontFamily: 'monospace',
      fontSize: 'inherit',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
    },
    th: {
      textAlign: 'left',
      borderBottomStyle: 'solid',
    },
    td: {
      textAlign: 'left',
      borderBottomStyle: 'solid',
    },
    img: {
      maxWidth: '100%',
    },
  },
}

export default theme
