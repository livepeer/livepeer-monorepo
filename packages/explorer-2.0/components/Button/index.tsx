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
  fontWeight: 600,
  textTransform: "uppercase",
  m: 0,
  px: "$3",
  py: 12,
  borderRadius: "$6",
  position: "relative",
  cursor: "pointer",
  "&:disabled": {
    bg: "$gray500",
    color: "$white",
    cursor: "not-allowed",
    opacity: 0.2,
    "&:hover": {
      bg: "$gray500",
    },
  },
  variants: {
    color: {
      primary: {
        color: "$primary",
        bg: "rgba(0,235,136,.1)",
        transition: "background-color .3s",
        "&:hover": {
          bg: "rgba(0,235,136,.05)",
          transition: "background-color .3s",
        },
        "&:focus": {
          bg: "rgba(0,235,136,.05)",
          boxShadow:
            "0 0 0 1px rgba(0,235,136,.05), inset 0 0 0 1px rgba(0,235,136,.05)",
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
    fullWidth: {
      true: {
        width: "100%",
      },
    },
    size: {
      small: {
        py: "$2",
        px: "$3",
        fontSize: "$1",
      },
      large: {
        py: "$3",
        px: "$3",
        fontSize: "$2",
      },
    },
  },
});

export default Button;
