import { global, theme } from "../stitches.config";

const globalStyles = global({
  body: {
    boxSizing: "border-box",
    margin: 0,
    fontFamily: "$body",
    color: "$text",
    lineHeight: 1.5,
  },

  svg: { display: "block" },

  pre: { margin: 0 },

  a: {
    textDecoration: "none",
    color: "$primary",
  },

  "::selection": {
    backgroundColor: "$gray500",
  },

  "h1, h2, h3, h4, h5, h6": {
    margin: 0,
  },

  ".MuiPaper-root div:nth-of-type(2)": {
    overflow: "initial !important",
  },

  ".MuiPaper-root div:nth-of-type(2) > div > div": {
    overflow: "initial !important",
  },

  ":root": {
    "--reach-dialog": "$2",
  },

  "[data-reach-dialog-overlay]": {
    background: "hsla(0, 0%, 0%, 0.33)",
    display: "flex",
    alignItems: "center",
    position: "fixed",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    overflow: "auto",
    zIndex: 1000,
  },
  "[data-reach-dialog-content]": {
    margin: "10vh auto",
    width: "90vw",
    maxHeight: "90vh",
    overflowY: "scroll",
    msOverflowStyle: "none", // IE 10+
    scrollbarWidth: "none", // Firefox
    backgroundColor: `$surface`,
    outline: "none",
    borderRadius: "16px",
    "@media (min-width: 672px)": {
      width: "65vw",
    },
    "@media (min-width: 1020px)": {
      maxWidth: 650,
    },
  },

  ".tooltip": {
    boxShadow: "0px 4px 4px rgba(0,0,0,0.15)",
    backgroundColor: "$lightBlack",
    fontWeight: 400,
    color: `$text`,
    maxWidth: 250,
    textAlign: "left",
    textTransform: "initial",
    opacity: "1 !important",
    borderRadius: "6px !important",
  },

  ".MuiStepper-vertical": {
    marginBottom: "-8px",
    padding: "0 !important",
  },

  ".MuiPaper-root": {
    backgroundColor: "transparent !important",
    color: `${theme.colors.text} !important`,
  },

  ".MuiStepLabel-label": {
    color: `${theme.colors.muted} !important`,
  },

  ".MuiStepLabel-active": {
    color: `${theme.colors.text} !important`,
  },

  ".MuiStepIcon-completed": {
    color: `${theme.colors.primary} !important`,
  },

  ".MuiStepIcon-active": {
    color: `${theme.colors.primary} !important`,
  },

  ".MuiStepIcon-active .MuiStepIcon-text": {
    fill: `${theme.colors.surface} !important`,
  },

  ".MuiStepIcon-text": {
    fontFamily: `${theme.fonts.body} !important`,
  },

  '[role="menuitemradio"]': {
    ":hover": {
      backgroundColor: `${theme.colors.gray500} !important`,
    },
  },
});

export default globalStyles;
