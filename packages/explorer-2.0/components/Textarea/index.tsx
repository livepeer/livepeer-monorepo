import { styled } from "../../stitches.config";

const Textarea = styled("textarea", {
  // Reset
  boxSizing: "border-box",
  appearance: "none",
  borderWidth: "0",
  fontFamily: "inherit",
  margin: "0",
  outline: "none",
  padding: "$3",
  width: "100%",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  backgroundColor: "rgba(255, 255, 255, 0.09)",
  borderRadius: "$4",
  boxShadow: "inset 0 0 0 1px $gray600",
  color: "$hiContrast",
  fontVariantNumeric: "tabular-nums",
  position: "relative",
  minHeight: 80,
  resize: "vertical",
  fontSize: "$3",

  ":focus": {
    boxShadow: "inset 0px 0px 0px 1px $blue700, 0px 0px 0px 1px $blue700",
    zIndex: "1",
  },
  "::placeholder": {
    color: "$gray800",
  },
  ":disabled": {
    pointerEvents: "none",
    backgroundColor: "$gray100",
    color: "$gray700",
    cursor: "not-allowed",
    resize: "none",
    "::placeholder": {
      color: "$gray600",
    },
  },
  ":read-only": {
    backgroundColor: "$gray100",
    ":focus": {
      boxShadow: "inset 0px 0px 0px 1px $gray600",
    },
  },

  variants: {
    size: {
      "1": {
        fontSize: "$1",
        lineHeight: "16px",
        px: "$1",
      },
      "2": {
        fontSize: "$2",
        lineHeight: "20px",
        px: "$2",
      },
      "3": {
        fontSize: "$3",
        lineHeight: "23px",
        px: "$3",
      },
    },
    state: {
      invalid: {
        boxShadow: "inset 0 0 0 1px $red600",
        ":focus": {
          boxShadow: "inset 0px 0px 0px 1px $red700, 0px 0px 0px 1px $red700",
        },
      },
      valid: {
        boxShadow: "inset 0 0 0 1px $green600",
        ":focus": {
          boxShadow:
            "inset 0px 0px 0px 1px $green700, 0px 0px 0px 1px $green700",
        },
      },
    },
    cursor: {
      default: {
        cursor: "default",
        ":focus": {
          cursor: "text",
        },
      },
      text: {
        cursor: "text",
      },
    },
  },
});

export default Textarea;
