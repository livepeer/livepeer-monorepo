import styled from "@emotion/styled";
import { colors } from "@material-ui/core";

const theme = require("styled-theming");

let { grey, common } = colors;
const chipStyles = theme.variants("mode", "variant", {
  default: {
    light: {
      backgroundColor: grey[500],
      color: grey[900],
      borderColor: "transparent"
    }
  },
  primary: {
    light: {
      backgroundColor: colors.green,
      color: grey[900],
      borderColor: colors.green
    }
  },
  outline: {
    light: {
      backgroundColor: "transparent",
      color: common.white,
      borderColor: common.white
    }
  }
});

export const Root = styled.div(
  {
    display: "flex",
    cursor: "pointer",
    borderRadius: 1000,
    borderStyle: "solid",
    borderWidth: 2,
    fontSize: 14,
    lineHeight: "initial",
    fontWeight: 500,
    alignItems: "center",
    padding: "4px 12px"
  },
  chipStyles
);
