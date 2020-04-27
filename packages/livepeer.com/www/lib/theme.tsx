import { Global } from "@emotion/core";
import React, { memo } from "react";
import { useThemeUI, ThemeProvider as TP, Styled } from "theme-ui";

export const theme = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: "inherit",
    monospace: "'Fira Code', Menlo, monospace"
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 56, 64, 96],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700
  },
  letterSpacings: {
    body: ".46px",
    heading: 0
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125
  },
  colors: {
    text: "#000",
    background: "#fff",
    primary: "#131418",
    secondary: "#FAF5EF",
    accent: "#00EB88",
    muted: "#eaeaea",
    gray: "#fafafa",
    listText: "#666666",
    extremelyBlue: "#0000ff"
  },
  buttons: {
    default: {
      color: "text",
      borderWidth: "1px",
      borderColor: "transparent",
      borderStyle: "solid",
      bg: "initial",
      fontWeight: 500,
      px: 4,
      letterSpacing: 0.75,
      py: "10px",
      cursor: "pointer",
      ":focus": {
        outline: "none"
      },
      ":disabled": {
        cursor: "not-allowed",
        backgroundColor: "muted",
        color: "listText",
        borderWidth: "1px",
        borderColor: "listText",
        borderStyle: "solid",
        opacity: 0.6
      }
    },
    primary: {
      variant: "buttons.default",
      color: "primary",
      bg: "accent",
      py: "10px"
    },
    secondary: {
      variant: "buttons.default",
      color: "background",
      bg: "primary",
      borderWidth: "1px",
      borderColor: "primary",
      borderStyle: "solid"
    },
    outline: {
      variant: "buttons.default",
      bg: "transparent",
      borderColor: "text",
      color: "text"
    },
    text: {
      variant: "buttons.default",
      border: 0,
      fontWeight: 300
    },
    large: {
      variant: "buttons.default",
      fontSize: 16
    },
    primaryLarge: {
      variant: "buttons.primary",
      fontSize: 16
    },
    outlineSmall: {
      variant: "buttons.outline",
      fontSize: 14,
      px: 3,
      py: 2
    },
    primarySmall: {
      variant: "buttons.primary",
      fontSize: 14,
      px: 3,
      py: 2
    },
    secondarySmall: {
      variant: "buttons.secondary",
      fontSize: 14,
      px: 3,
      py: 2
    }
  },
  forms: {
    input: {
      padding: 3,
      borderColor: "listText"
    }
  },
  layout: {
    container: {
      maxWidth: 1200,
      px: [3, 3, 3, 3, 0]
    }
  },
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
      letterSpacing: "body",
      height: "100%"
    },
    h1: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      letterSpacing: "heading",
      fontSize: 7
    },
    h2: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      letterSpacing: "heading",
      fontSize: 6
    },
    h3: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      letterSpacing: "heading",
      fontSize: 5
    },
    h4: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      letterSpacing: "heading",
      fontSize: 4
    },
    h5: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      letterSpacing: "heading",
      fontSize: 3
    },
    h6: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      letterSpacing: "heading",
      fontSize: 2
    },
    p: {
      color: "text",
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body"
    },
    a: {
      color: "#0000ff"
    },
    pre: {
      fontFamily: "monospace",
      overflowX: "auto",
      padding: 4,
      cursor: "text",
      backgroundColor: t => `${t.colors.primary} !important`,
      code: {
        color: "inherit",
        WebkitFontSmoothing: "antialiased"
      }
    },
    code: {
      fontFamily: "monospace",
      fontSize: "inherit"
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0
    },
    th: {
      textAlign: "left",
      borderBottomStyle: "solid"
    },
    td: {
      textAlign: "left",
      borderBottomStyle: "solid"
    },
    img: {
      maxWidth: "100%"
    }
  }
};

const ThemeProvider = memo(({ children, ...props }) => (
  <TP theme={theme} {...props}>
    <Styled.root>{children}</Styled.root>
  </TP>
));

const Reset = () => (
  <Global
    styles={{
      body: {
        margin: "0"
      },
      "h1, h2, h3, h4, h5, h6": {
        margin: 0
      },
      h1: {
        fontSize: 56
      },
      h2: {
        fontSize: 48
      },
      h3: {
        fontSize: 32
      },
      h4: {
        fontSize: 24
      },
      h5: {
        fontSize: 20
      },
      small: {
        fontSize: "100%"
      },
      a: {
        color: "#131418"
      },
      button: {
        border: 0,
        padding: 0,
        fontSize: "100%",
        backgroundColor: "transparent"
      },
      ".react-reveal": {
        opacity: 0
      }
    }}
  />
);

export { useThemeUI as useTheme, Reset, ThemeProvider };
