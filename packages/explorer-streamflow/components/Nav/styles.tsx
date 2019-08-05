import styled from "@emotion/styled";
import { colors } from "@material-ui/core";

let { common } = colors;

export const Root = styled.div({
  display: "flex",
  alignItems: "center",
  marginRight: 4
});

export const NavItem = styled.a<{ active?: boolean }>(() => ({
  display: "flex",
  color: common.white,
  alignItems: "center",
  fontSize: 14,
  padding: "0 16px",
  fontWeight: 400
}));
