import grey from '@material-ui/core/colors/grey';

const arr = Object.values(grey);
console.log(arr)
// Create a theme instance.
const theme = {
  // this enables the color modes feature
  // and is used as the name for the top-level colors object
  initialColorMode: 'dark',
  // optionally enable custom properties
  // to help avoid a flash of colors on page load
  useCustomProperties: true,
  fonts: {
    body: 'Akkurat, sans-serif',
    heading: '"Akkurat-Bold", sans-serif',
    monospace: 'Akkurat-Mono, monospace',
  },
  colors: {
    text: '#fff',
    background: '#131418',
    primary: '#6BE691',
    grey: arr,
    modes: {
      light: {
        text: '#fff',
        background: '#131418',
        primary: '#6BE691',
      }
    }
  },
  textStyles: {
    heading: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
    },
  },
  styles: {
    Main: {
      bg: '#131418',
      color: '#fff',
      fontFamily: 'body'
    },
    root: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },
    p: {
      fontFamily: 'body',
      fontSize: [2, 3],
    },
    h1: {
      variant: 'textStyles.heading',
      fontSize: [5, 6, 7],
    },
    h2: {
      variant: 'textStyles.heading',
      fontSize: [4, 5],
    },
  }
}

export default theme
