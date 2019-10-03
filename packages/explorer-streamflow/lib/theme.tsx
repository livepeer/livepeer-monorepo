const heading = {
  color: 'text',
  fontFamily: 'heading',
  lineHeight: 'heading',
  fontWeight: 'heading'
}

const theme = {
  initialColorMode: 'dark',
  space: [0, 8, 16, 24, 32, 40, 48, 56, 64],
  fonts: {
    body:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    heading:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monospace: '"SF Mono", "Roboto Mono", monospace'
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 40, 48, 64, 96],
  fontWeights: {
    body: 400,
    heading: 700
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125
  },
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
    border: 'rgba(255, 255, 255, .16)',
    modes: {}
  },
  buttons: {
    primary: {
      color: 'background',
      bg: 'primary'
    },
    secondary: {
      color: 'text',
      bg: 'transparent',
      border: '1px solid',
      borderColor: 'border',
      transition: 'border-color .2s',
      '&:hover': {
        borderColor: 'text',
        transition: 'border-color .2s'
      }
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body'
    },
    h1: {
      ...heading,
      fontSize: 5
    },
    h2: {
      ...heading,
      fontSize: 4
    },
    h3: {
      ...heading,
      fontSize: 3
    },
    h4: {
      ...heading,
      fontSize: 2
    },
    h5: {
      ...heading,
      fontSize: 1
    },
    h6: {
      ...heading,
      fontSize: 0
    },
    p: {
      color: 'text',
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
      margin: 0
    },
    a: {
      color: 'primary'
    },
    pre: {
      fontFamily: 'monospace',
      overflowX: 'auto',
      code: {
        color: 'inherit'
      }
    },
    code: {
      fontFamily: 'monospace',
      fontSize: 'inherit'
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0
    },
    th: {
      textAlign: 'left',
      borderBottomStyle: 'solid'
    },
    td: {
      textAlign: 'left',
      borderBottomStyle: 'solid'
    },
    img: {
      maxWidth: '100%'
    }
  }
}

export default theme
