import Box from "../Box";
import Flex from "../Flex";
import Logo from "../Logo";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import RoundStatus from "../RoundStatus";
import { gql, useApolloClient } from "@apollo/client";
import UniswapModal from "../UniswapModal";
import AccountMenu from "../AccountMenu";
import { styled } from "../../stitches.config";

const BottomLink = styled("a", {
  display: "flex",
  alignItems: "center",
  fontSize: "$2",
  color: "$muted",
  transition: "color .3s",
  "&:hover": {
    color: "$primary",
    transition: "color .3s",
  },
});

const Index = ({ items = [], open, onDrawerOpen, onDrawerClose }) => {
  const router = useRouter();
  const client = useApolloClient();
  const { asPath } = router;

  Router.events.on("routeChangeStart", () => {
    onDrawerClose();
  });

  return (
    <>
      <Flex
        onClick={onDrawerOpen}
        css={{
          left: 0,
          top: 0,
          bg: "$black",
          zIndex: 100,
          width: 240,
          transition: ".3s",
          transform: `translateX(${open ? 0 : "-100%"})`,
          position: "fixed",
          flexDirection: "column",
          height: "100vh",
          pt: "$4",
          px: 24,
          boxShadow:
            "0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)",
          alignItems: "center",
          justifyContent: "space-between",
          "&:after": {
            pointerEvents: "none",
            content: '""',
            position: "absolute",
            height: "550px",
            top: "0",
            left: "0",
            width: "100%",
            background:
              "linear-gradient(127.48deg,rgba(38,233,138,0.18) -29.81%,rgba(196,196,196,0) 58.42%)",
          },
          "@bp2": {
            pt: "$4",
          },
          "@bp3": {
            boxShadow: "none",
            transform: "none",
            position: "sticky",
          },
        }}>
        <Flex
          css={{
            alignSelf: "flex-start",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}>
          <Logo isDark />
          <Box css={{ mb: "auto" }}>
            {items.map((item, i) => (
              <Link key={i} href={item.href} as={item.as} passHref>
                <Box
                  as="a"
                  css={{
                    color:
                      asPath.split("?")[0] === item.as ? "$text" : "$muted",
                    lineHeight: "initial",
                    display: "flex",
                    fontSize: "$2",
                    fontWeight: 500,
                    cursor: "pointer",
                    alignItems: "center",
                    py: "10px",
                    borderRadius: 5,
                    transition: "color .3s",
                    "&:hover": {
                      color: "white",
                      transition: "color .3s",
                    },
                  }}>
                  <Flex
                    css={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: 18,
                      height: 18,
                      mr: "$3",
                    }}>
                    <item.icon />
                  </Flex>
                  {item.name}
                </Box>
              </Link>
            ))}
            <Box className="tour-step-1">
              <AccountMenu />
            </Box>
          </Box>
          <Box css={{ mb: "$4" }}>
            <Box
              css={{
                mb: "$4",
                pb: 18,
                borderBottom: "1px solid",
                borderColor: "$border",
              }}>
              <BottomLink
                css={{ mb: 10 }}
                as="a"
                href="https://livepeer.org"
                target="_blank"
                rel="noopener noreferrer">
                Livepeer.org
              </BottomLink>
              <BottomLink
                css={{ mb: 10 }}
                as="a"
                href="https://livepeer.org/docs"
                target="_blank"
                rel="noopener noreferrer">
                Docs
              </BottomLink>
              <BottomLink
                css={{ cursor: "pointer", mb: 10 }}
                onClick={() =>
                  client.writeQuery({
                    query: gql`
                      query {
                        uniswapModalOpen
                      }
                    `,
                    data: {
                      uniswapModalOpen: true,
                    },
                  })
                }
                className="tour-step-3">
                Get LPT
                <UniswapModal>
                  <iframe
                    className="tour-step-4"
                    style={{
                      background: "#323639",
                      width: "100%",
                      height: "100%",
                      border: "0",
                    }}
                    src={`https://uniswap.exchange/swap/0x58b6a8a3302369daec383334672404ee733ab239`}
                  />
                </UniswapModal>
              </BottomLink>
              <BottomLink
                css={{ mb: 10 }}
                as="a"
                href="https://discord.gg/uaPhtyrWsF"
                rel="noopener noreferrer"
                target="_blank">
                Discord
              </BottomLink>
              <Box>
                <Link href="/whats-new" passHref>
                  <BottomLink as="a">What's New</BottomLink>
                </Link>
              </Box>
            </Box>
            <RoundStatus />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Index;
