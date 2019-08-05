/** @jsx jsx */
import { jsx } from "theme-ui";

import { Layout, Header, Main, Container, Footer } from "theme-ui";

export default () => (
  <Main
    sx={{
      background: "primary",
      fontFamily: "heading"
    }}
  >
    I am a sidebar
    <Container>cool</Container>
  </Main>
);
