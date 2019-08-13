import styled from "@emotion/styled";

export const CardRow = styled.div({
  color: "inherit",
  display: "block",
  marginBottom: 24,
  ":last-child": {
    marginBottom: 0
  }
});

export const AvatarGroup = styled.div({
  display: "flex",
  alignItems: "center"
});
