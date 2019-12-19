/** @jsx jsx */
import Head from "next/head";
import { Drawer } from "@livepeer/ui";
import { Styled, Flex, Box, jsx } from "theme-ui";

const Live = () => {
  return <Box sx={{ fontFamily: "monospace" }}>&nbsp;&nbsp;🔴&nbsp;&nbsp;</Box>;
};

const Stream = () => {
  return <Box sx={{ fontFamily: "monospace" }}>&nbsp;&nbsp;🌊&nbsp;&nbsp;</Box>;
};

const menuItems = [
  { name: "LIVE", href: "/", icon: Live },
  { name: "Streams", href: "/stream", icon: Stream }
  // // { name: 'Account', link: '/account', icon: Account },
  // { name: 'Connect Wallet', link: '/connect-wallet', icon: Wallet },
];

const Layout = ({ children, title = "Livepeer.live" }: any) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {/* <Reset /> */}
    <Styled.root>
      <Flex style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Drawer items={menuItems} />
        {children}
      </Flex>
    </Styled.root>
  </>
);

export default Layout;
