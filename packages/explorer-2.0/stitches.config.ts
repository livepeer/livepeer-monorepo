import { createCss } from "@stitches/react";

export * from "@stitches/react";

export const defaultTheme = {
  fontSizes: {
    1: "12px",
    2: "14px",
    3: "16px",
    4: "20px",
    5: "24px",
    6: "32px",
    7: "48px",
    8: "64px",
    9: "72px",
  },
  space: {
    1: "4px",
    2: "8px",
    3: "16px",
    4: "32px",
    5: "64px",
    6: "128px",
    7: "256px",
    8: "512px",
  },
  sizes: {
    1: "4px",
    2: "8px",
    3: "16px",
    4: "32px",
    5: "64px",
    6: "128px",
    7: "256px",
    8: "512px",
  },
  lineHeights: {
    1: "18px",
    2: "21px",
    3: "24px",
    4: "30px",
    5: "36px",
    6: "48px",
    7: "72px",
    8: "96px",
    9: "108px",
  },
  fonts: {
    body:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: "inherit",
    monospace: '"Roboto Mono", Menlo, monospace',
  },
  fontWeights: {
    body: 400,
    heading: 600,
  },
  colors: {
    gray100: "hsl(0, 0%, 72%)",
    gray200: "hsl(0, 0%, 64%)",
    gray300: "hsl(0, 0%, 56%)",
    gray400: "hsl(0, 0%, 48%)",
    gray500: "hsl(0, 0%, 40%)",
    gray600: "hsl(0, 0%, 32%)",
    gray700: "hsl(0, 0%, 24%)",
    gray800: "hsl(0, 0%, 16%)",
    gray900: "hsl(0, 0%, 8%)",
    green100: "hsl(155, 100%, 78%)",
    green200: "hsl(155, 100%, 70%)",
    green300: "hsl(155, 100%, 62%)",
    green400: "hsl(155, 100%, 54%)",
    green500: "hsl(155, 100%, 46%)",
    green600: "hsl(155, 100%, 38%)",
    green700: "hsl(155, 100%, 30%)",
    green800: "hsl(155, 100%, 22%)",
    green900: "hsl(155, 100%, 14%)",
    blue100: "hsl(240, 74%, 89%)",
    blue200: "hsl(240, 74%, 81%)",
    blue300: "hsl(240, 74%, 73%)",
    blue400: "hsl(240, 74%, 65%)",
    blue500: "hsl(240, 74%, 57%)",
    blue600: "hsl(240, 74%, 49%)",
    blue700: "hsl(240, 74%, 41%)",
    blue800: "hsl(240, 74%, 33%)",
    blue900: "hsl(240, 74%, 25%)",
    red100: "hsl(352, 100%, 82%)",
    red200: "hsl(352, 100%, 74%)",
    red300: "hsl(352, 100%, 66%)",
    red400: "hsl(352, 100%, 58%)",
    red500: "hsl(352, 100%, 50%)",
    red600: "hsl(352, 100%, 42%)",
    red700: "hsl(352, 100%, 34%)",
    red800: "hsl(352, 100%, 26%)",
    red900: "hsl(352, 100%, 18%)",

    // Semantic colors

    hiContrast: "#000000",
    loContrast: "#ffffff",
    black: "#000000",
    white: "#ffffff",
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
    border: "#393a3d",
    highlight: "transparent",
  },
  radii: {
    1: "2px",
    2: "4px",
    3: "8px",
    4: "10px",
    5: "12px",
    6: "14px",
    round: "9999px",
  },
};

export const darkTheme = {
  gray100: "hsl(0, 0%, 8%)",
  gray200: "hsl(0, 0%, 16%)",
  gray300: "hsl(0, 0%, 24%)",
  gray400: "hsl(0, 0%, 32%)",
  gray500: "hsl(0, 0%, 40%)",
  gray600: "hsl(0, 0%, 48%)",
  gray700: "hsl(0, 0%, 56%)",
  gray800: "hsl(0, 0%, 64%)",
  gray900: "hsl(0, 0%, 72%)",
  green100: "hsl(155, 100%, 14%)",
  green200: "hsl(155, 100%, 22%)",
  green300: "hsl(155, 100%, 30%)",
  green400: "hsl(155, 100%, 38%)",
  green500: "hsl(155, 100%, 46%)",
  green600: "hsl(155, 100%, 54%)",
  green700: "hsl(155, 100%, 62%)",
  green800: "hsl(155, 100%, 70%)",
  green900: "hsl(155, 100%, 78%)",
  blue100: "hsl(240, 74%, 25%)",
  blue200: "hsl(240, 74%, 33%)",
  blue300: "hsl(240, 74%, 41%)",
  blue400: "hsl(240, 74%, 49%)",
  blue500: "hsl(240, 74%, 57%)",
  blue600: "hsl(240, 74%, 65%)",
  blue700: "hsl(240, 74%, 73%)",
  blue800: "hsl(240, 74%, 81%)",
  blue900: "hsl(240, 74%, 89%)",
  red100: "hsl(352, 100%, 18%)",
  red200: "hsl(352, 100%, 26%)",
  red300: "hsl(352, 100%, 34%)",
  red400: "hsl(352, 100%, 42%)",
  red500: "hsl(352, 100%, 50%)",
  red600: "hsl(352, 100%, 58%)",
  red700: "hsl(352, 100%, 66%)",
  red800: "hsl(352, 100%, 74%)",
  red900: "hsl(352, 100%, 82%)",

  // Semantic colors

  hiContrast: "#ffffff",
  loContrast: "#000000",
  text: "rgba(255, 255, 255, .87)",
  background: "#0d1117",
  primary: "$green500",
  surface: "#17191e",
  lightBlack: "#26282c",
  muted: "rgba(255,255,255,.6)",
  red: "#ff0022",
  yellow: "#FFC53A",

  skyBlue: "#5bc2ee",
  teal: "#00bfb2",
  black: "#000",
  border: "#393a3d",
  highlight: "transparent",
};

const media = {
  bp1: `(min-width: 520px)`,
  bp2: `(min-width: 900px)`,
  bp3: `(min-width: 1200px)`,
  bp4: `(min-width: 1580px)`,
  motion: `(prefers-reduced-motion)`,
  hover: `(hover: hover)`,
  dark: `(prefers-color-scheme: dark)`,
  light: `(prefers-color-scheme: light)`,
};

const utils = {
  // Abbreviated margin properties
  m: () => (value) => ({
    marginTop: value,
    marginBottom: value,
    marginLeft: value,
    marginRight: value,
  }),
  mt: () => (value) => ({
    marginTop: value,
  }),
  mr: () => (value) => ({
    marginRight: value,
  }),
  mb: () => (value) => ({
    marginBottom: value,
  }),
  ml: () => (value) => ({
    marginLeft: value,
  }),
  mx: () => (value) => ({
    marginLeft: value,
    marginRight: value,
  }),
  my: () => (value) => ({
    marginTop: value,
    marginBottom: value,
  }),
  p: () => (value) => ({
    paddingTop: value,
    paddingBottom: value,
    paddingLeft: value,
    paddingRight: value,
  }),
  pt: () => (value) => ({
    paddingTop: value,
  }),
  pr: () => (value) => ({
    paddingRight: value,
  }),
  pb: () => (value) => ({
    paddingBottom: value,
  }),
  pl: () => (value) => ({
    paddingLeft: value,
  }),
  px: () => (value) => ({
    paddingLeft: value,
    paddingRight: value,
  }),
  py: () => (value) => ({
    paddingTop: value,
    paddingBottom: value,
  }),

  // Abbreviated background color property
  bg: () => (value) => ({
    backgroundColor: value,
  }),

  // A property for applying width/height together
  size: () => (value) => ({
    width: value,
    height: value,
  }),

  // A property to apply linear gradient
  linearGradient: () => (value) => ({
    backgroundImage: `linear-gradient(${value})`,
  }),

  // An abbreviated property for border-radius
  br: () => (value) => ({
    borderRadius: value,
  }),
};

export const {
  styled,
  theme,
  css,
  global,
  keyframes,
  getCssString,
} = createCss({
  theme: defaultTheme,
  utils,
  media,
});

export const darkThemeClass = theme({ colors: darkTheme });
