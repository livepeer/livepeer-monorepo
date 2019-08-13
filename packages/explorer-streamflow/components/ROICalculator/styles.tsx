/** @jsx jsx */
import { jsx, Styled } from "theme-ui";

export const Card = (props: any) => (
  <Styled.div
    sx={{
      width: "100%",
      p: 3,
      bg: "background"
    }}
  >
    {props.children}
  </Styled.div>
);
