import styled from "@emotion/styled";
import { colors } from "@material-ui/core";

let { common } = colors;

export const Form = styled.div({
  display: "flex",
  paddingBottom: 8,
  borderBottom: `1px solid ${common.white}`,
  minWidth: 240,
  justifyContent: "space-between"
});

export const Textfield = styled.input({
  border: 0,
  fontSize: 14,
  color: common.white,
  fontWeight: 500,
  backgroundColor: "transparent",
  outline: "none"
});

export const SubmitButton = styled.img({});
