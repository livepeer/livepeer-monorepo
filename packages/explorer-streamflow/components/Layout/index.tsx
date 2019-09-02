import * as React from "react";
import Head from "next/head";
import Drawer from "../Drawer";
import Reset from "../../lib/reset";
import { Styled, Flex } from "theme-ui";

const Layout = ({ children, title = "Livepeer Explorer" }: any) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Reset />
    <Styled.root>
      <Flex style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Drawer />
        {children}
      </Flex>
    </Styled.root>
  </>
);

export default Layout;
