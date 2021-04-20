import { styled } from "../../stitches.config";

export const Button = styled("button", {
  // Reset
  boxSizing: "border-box",
  border: 0,
  appearance: "none",
  display: "inline-block",
  textAlign: "center",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "700",
  textTransform: "uppercase",
  m: 0,
  px: "$3",
  py: 12,
  borderRadius: "$4",
  position: "relative",
  cursor: "pointer",
  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.1,
  },
  variants: {
    color: {
      primary: {
        color: "$loContrast",
        bg: "$green500",
        transition: "background-color .3s",
        "@hover": {
          "&:hover": {
            bg: "$green400",
            transition: "background-color .3s",
          },
        },
        "&:focus": {
          backgroundColor: "$green400",
          boxShadow:
            "0 0 0 1px $colors$green400, inset 0 0 0 1px $colors$green400",
        },
      },
      secondary: {
        color: "$hiContrast",
        bg: "$gray100",
        transition: "background-color .3s",
        "@hover": {
          "&:hover": {
            bg: "$gray200",
            transition: "background-color .3s",
          },
        },
        "&:focus": {
          backgroundColor: "$gray200",
          boxShadow:
            "0 0 0 1px $colors$gray200, inset 0 0 0 1px $colors$gray200",
        },
      },
      danger: {
        backgroundColor: "$red500",
        color: "$loContrast",
        "@hover": {
          "&:hover": {
            bg: "$red400",
            transition: "background-color .3s",
          },
        },
        "&:focus": {
          backgroundColor: "$red400",
          boxShadow: "0 0 0 1px $colors$red400, inset 0 0 0 1px $colors$red400",
        },
      },
    },
    outline: {
      true: {
        color: "$primary",
        bg: "transparent",
        border: "1px solid",
        borderColor: "$primary",
      },
    },
    size: {
      small: {
        py: "$2",
        px: "$3",
        fontSize: "$1",
      },
      large: {
        fontSize: "15px",
        paddingLeft: "15px",
        paddingRight: "15px",
      },
    },
  },
});

export default Button;
