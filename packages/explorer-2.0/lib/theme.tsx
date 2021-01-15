const heading = {
  color: "text",
  fontFamily: "heading",
  lineHeight: "heading",
  fontWeight: "heading",
};

const theme = {
  initialColorMode: "dark",
  space: [0, 8, 16, 24, 32, 40, 48, 56, 64],
  fonts: {
    body:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: "inherit",
    monospace: '"Roboto Mono", Menlo, monospace',
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
  breakpoints: ["480px", "672px", "1020px", "1380px", "1500px"],
  colors: {
    text: "rgba(255, 255, 255, .87)",
    background: "#0d1117",
    primary: "#00EB88",
    surface: "#17191e",
    lightBlack: "#26282c",
    muted: "rgba(255,255,255,.6)",
    red: "#ff0022",
    yellow: "#FFC53A",
    blue: "#0062eb",
    skyBlue: "#5bc2ee",
    teal: "#00bfb2",
    black: "#000",
    border: "#393a3d",
    gray: "#5a5a5a",
    highlight: "transparent",
    modes: {},
  },
  buttons: {
    primary: {
      color: "background",
      bg: "primary",
      borderRadius: 10,
      "&:hover": {
        transition: ".2s background-color",
        backgroundColor: "rgba(0, 235, 136, .7)",
      },
    },
    secondary: {
      color: "text",
      bg: "transparent",
      border: "1px solid",
      borderColor: "border",
      transition: "border-color .2s",
      borderRadius: 10,
      "&:hover": {
        borderColor: "text",
        transition: "border-color .2s",
      },
    },
    outline: {
      color: "text",
      bg: "transparent",
      border: "1px solid",
      borderColor: "text",
      transition: "border-color .2s",
      borderRadius: 10,
      "&:hover": {
        borderColor: "inherit",
        transition: "border-color .2s",
      },
    },
    primarySmall: {
      variant: "buttons.primary",
      py: "6px",
      px: 2,
    },
    primaryOutline: {
      variant: "buttons.outline",
      bg: "transparent",
      color: "primary",
      border: "1px solid",
      borderColor: "primary",
    },
    primaryOutlineSmall: {
      bg: "transparent",
      color: "primary",
      border: "1px solid",
      borderColor: "primary",
      fontSize: 0,
      px: 1,
      py: "2px",
      borderRadius: 10,
    },
    text: {
      color: "primary",
      border: 0,
      bg: "transparent",
      p: 0,
    },
    danger: {
      borderRadius: 10,
      cursor: "pointer",
      backgroundColor: "rgba(211, 47, 47, .1)",
      transition: ".2s background-color",
      color: "red",
      "&:hover": {
        transition: ".2s background-color",
        backgroundColor: "rgba(211, 47, 47, .2)",
      },
    },
    dangerSmall: {
      variant: "buttons.danger",
      py: "6px",
      px: 2,
    },
    rainbow: {
      borderRadius: 10,
      color: "text",
      bg:
        "linear-gradient(260.35deg, #F1BC00 0.25%, #E926BE 47.02%, #9326E9 97.86%)",
    },
    transparent: {
      borderRadius: 10,
      color: "text",
      bg: "rgba(255,255,255,.08)",
      transition: ".2s background",
      "&:hover": {
        transition: ".2s background",
        bg: "rgba(255,255,255,.1)",
      },
    },
    red: {
      color: "background",
      bg: "red",
      borderRadius: 10,
      "&:hover": {
        transition: ".2s background-color",
        backgroundColor: "rgba(211, 47, 47, .7)",
      },
    },
  },
  text: {
    passed: {
      color: "primary",
    },
    rejected: {
      color: "red",
    },
    active: {
      color: "white",
    },
  },
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
    },
    spinner: {
      size: 26,
    },
    h1: {
      ...heading,
      fontSize: 5,
    },
    h2: {
      ...heading,
      fontSize: 2,
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
      color: "text",
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body",
      margin: "0 0 16px",
    },
    a: {
      color: "primary",
    },
    pre: {
      fontFamily: "monospace",
      overflowX: "auto",
      code: {
        color: "inherit",
      },
    },
    code: {
      fontFamily: "monospace",
      fontSize: "inherit",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
    },
    th: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    td: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    img: {
      maxWidth: "100%",
    },
  },
};

export default theme;
