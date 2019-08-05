import styled from "@emotion/styled";
import { colors } from "@material-ui/core";

let { grey } = colors;

export const Root = styled.div({
  backgroundColor: grey[900],
  height: "72px",
  width: "100%",
  position: "fixed",
  display: "flex",
  alignItems: "center"
});

export const Wrapper = styled.div({
  display: "flex",
  alignItems: "center"
});

export const NavGroup = styled.div({
  display: "flex",
  alignItems: "center"
});

export const Logo = styled.img({
  marginRight: 16
});
