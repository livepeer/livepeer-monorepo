import styled from "@emotion/styled";
import { colors } from "@material-ui/core";

let { grey, common } = colors;

export const Root = styled.div({
  backgroundColor: grey[900],
  padding: "32px 0 16px",
  width: "100%"
});

export const Title = styled.h1({
  color: common.white,
  fontSize: "24px",
  fontWeight: 200
});
