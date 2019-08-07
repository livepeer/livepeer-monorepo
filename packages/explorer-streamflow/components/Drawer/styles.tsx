/** @jsx jsx */
import { jsx, Styled } from "theme-ui";

export const StyledLink = (props: any) => (
  <Styled.a
    sx={{
      color: !props.i ? "primary" : "muted",
      lineHeight: "initial",
      display: "flex",
      fontSize: 18,
      cursor: "pointer",
      alignItems: "center",
      p: 3,
      fontWeight: "bold",
      backgroundColor: !props.i ? "rgba(107, 230, 145, .1)" : "transparent",
      borderRadius: 4,
      mb: 2,
      transition: "backgroundColor .3s, color .3s",
      ":nth-last-of-type": {
        mb: 0
      },
      ":hover": {
        backgroundColor: "rgba(107, 230, 145, .1)",
        color: "primary",
        transition: "backgroundColor .3s, color .3s"
      }
    }}
  >
    {props.children}
  </Styled.a>
);
