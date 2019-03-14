import { injectGlobal } from 'styled-components'

export default () => {
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
    * {
      box-sizing: border-box;
      font-weight: 300;
      font-family: 'Helvetica Neue', helvetica, arial, sans-serif;
    }
    strong, b {
      font-weight: 500;
    }
    html, body {
      margin: 0;
      height: 100%;
      font-family: 'Helvetica Neue', helvetica, arial, sans-serif;
      background: var(--bg-light);
    }
    a { color: #03a678; }
    p, ul {
      line-height: 1.5
      font-family: 'Helvetica Neue', helvetica, arial, sans-serif;
    }
  `
}
