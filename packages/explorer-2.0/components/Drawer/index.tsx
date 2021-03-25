import { Flex, Box } from "theme-ui";
import Logo from "../Logo";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import StakingGuide from "../StakingGuide";
import RoundStatus from "../RoundStatus";
import { gql, useApolloClient } from "@apollo/client";
import UniswapModal from "../UniswapModal";
import AccountMenu from "../AccountMenu";

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
        sx={{
          left: 0,
          top: 0,
          bg: "black",
          zIndex: 100,
          width: 240,
          transition: ".3s",
          transform: [
            `translateX(${open ? 0 : "-100%"})`,
            `translateX(${open ? 0 : "-100%"})`,
            `translateX(${open ? 0 : "-100%"})`,
            "none",
          ],
          position: ["fixed", "fixed", "fixed", "sticky"],
          flexDirection: "column",
          height: "100vh",
          pt: [3, 3, 5],
          px: 3,
          boxShadow: [
            "0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)",
            "0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)",
            "0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)",
            "none",
          ],
          alignItems: "center",
          justifyContent: "space-between",
          ":after": {
            pointerEvents: "none",
            content: '""',
            position: "absolute",
            height: 550,
            top: 0,
            left: 0,
            width: "100%",
            background:
              "linear-gradient(127.48deg,rgba(38,233,138,0.18) -29.81%,rgba(196,196,196,0) 58.42%)",
          },
        }}>
        <Flex
          sx={{
            alignSelf: "flex-start",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}>
          <Logo isDark pushSx={{ width: 110, mb: 3 }} />
          <Box sx={{ marginBottom: "auto" }}>
            {items.map((item, i) => (
              <Link key={i} href={item.href} as={item.as} passHref>
                <a
                  sx={{
                    color: asPath.split("?")[0] === item.as ? "white" : "muted",
                    lineHeight: "initial",
                    display: "flex",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    alignItems: "center",
                    py: "10px",
                    backgroundColor: "transparent",
                    borderRadius: 5,
                    transition: "color .3s",
                    "&:hover": {
                      color: "white",
                      transition: "color .3s",
                    },
                  }}>
                  <item.icon sx={{ width: 20, height: 20, mr: "10px" }} />
                  {item.name}
                </a>
              </Link>
            ))}
            <Box className="tour-step-1">
              <AccountMenu />
            </Box>
            <StakingGuide sx={{ display: ["none", "none", "none", "block"] }}>
              Staking Guide
            </StakingGuide>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                mb: 3,
                pb: 18,
                borderBottom: "1px solid",
                borderColor: "border",
              }}>
              <Box sx={{ mb: 10 }}>
                <a
                  href="https://livepeer.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 1,
                    color: "muted",
                    transition: "color .3s",
                    "&:hover": {
                      color: "primary",
                      transition: "color .3s",
                    },
                  }}>
                  Livepeer.org
                </a>
              </Box>
              <Box sx={{ mb: 10 }}>
                <a
                  href="https://livepeer.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 1,
                    color: "muted",
                    transition: "color .3s",
                    "&:hover": {
                      color: "primary",
                      transition: "color .3s",
                    },
                  }}>
                  Docs
                </a>
              </Box>
              <Flex
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
                sx={{
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "color .3s",
                  fontSize: 1,
                  mb: 10,
                  color: "muted",
                  "&:hover": {
                    color: "primary",
                    transition: "color .3s",
                  },
                }}
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
              </Flex>
              <Box>
                <a
                  href="https://discord.gg/uaPhtyrWsF"
                  rel="noopener noreferrer"
                  target="_blank"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 1,
                    mb: 10,
                    color: "muted",
                    transition: "color .3s",
                    "&:hover": {
                      color: "primary",
                      transition: "color .3s",
                    },
                  }}>
                  Discord
                </a>
              </Box>
              <Box>
                <Link href="/whats-new" as="/whats-new" passHref>
                  <a
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: 1,
                      color: "muted",
                      transition: "color .3s",
                      "&:hover": {
                        color: "primary",
                        transition: "color .3s",
                      },
                    }}>
                    What's New
                  </a>
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

/* {context.active && (
                <Flex
                  onClick={() => {
                    client.writeQuery({
                      query: gql`
                        query {
                          walletModalOpen
                        }
                      `,
                      data: {
                        walletModalOpen: true,
                      },
                    })
                  }}
                  sx={{
                    mt: 2,
                    cursor: 'pointer',
                    alignItems: 'center',
                    fontSize: 1,
                    color: 'muted',
                    transition: 'color .3s',
                    '&:hover': {
                      color: 'primary',
                      transition: 'color .3s',
                    },
                  }}
                >
                  
                  {context.account.replace(context.account.slice(5, 39), '…')}
                </Flex>
              )} */
