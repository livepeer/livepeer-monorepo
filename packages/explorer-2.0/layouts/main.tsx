import Box from "../components/Box";
import Flex from "../components/Flex";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Drawer from "../components/Drawer";
import { networksTypes } from "../lib/utils";
import Ballot from "../public/img/ballot.svg";
import DNS from "../public/img/dns.svg";
import { useWeb3React } from "@web3-react/core";
import Header from "../components/Header";
import Router from "next/router";
import useWindowSize from "react-use/lib/useWindowSize";
import WalletModal from "../components/WalletModal";
import { useQuery, useApolloClient, gql } from "@apollo/client";
import ReactGA from "react-ga";
import { isMobile } from "react-device-detect";
import ProgressBar from "../components/ProgressBar";
import { useMutations, useOnClickOutside } from "../hooks";
import { MutationsContext } from "../contexts";
import TxStartedDialog from "../components/TxStartedDialog";
import TxConfirmedDialog from "../components/TxConfirmedDialog";
import Modal from "../components/Modal";
import TxSummaryDialog from "../components/TxSummaryDialog";
import GET_SUBMITTED_TXS from "../queries/transactions.gql";
import { FiArrowRight, FiX } from "react-icons/fi";
import Link from "next/link";
import globalStyles from "../lib/globalStyles";
import { EyeOpenIcon } from "@modulz/radix-icons";

if (process.env.NODE_ENV === "production") {
  ReactGA.initialize(process.env.NEXT_PUBLIC_GA_TRACKING_ID);
} else {
  ReactGA.initialize("test", { testMode: true });
}

type DrawerItem = {
  name: any;
  href: string;
  as: string;
  icon: React.ElementType;
  className?: string;
};

// increment this value when updating the banner
const uniqueBannerID = 2;

const Layout = ({
  children,
  title = "Livepeer Explorer",
  headerTitle = "",
}) => {
  const client = useApolloClient();
  const context = useWeb3React();

  const { data } = useQuery(
    gql`
      {
        polls {
          isActive
          endBlock
        }
        protocol(id: "0") {
          id
          paused
        }
      }
    `
  );
  const mutations = useMutations();
  const { data: transactionsData } = useQuery(GET_SUBMITTED_TXS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bannerActive, setBannerActive] = useState(false);
  const [txDialogState, setTxDialogState]: any = useState([]);
  const { width } = useWindowSize();
  const ref = useRef();
  const totalActivePolls = data?.polls.filter((p) => p.isActive).length;
  const GET_TX_SUMMARY_MODAL = gql`
    {
      txSummaryModal @client {
        __typename
        open
        error
      }
    }
  `;

  const { data: txSummaryModalData } = useQuery(GET_TX_SUMMARY_MODAL);

  useEffect(() => {
    const storage = JSON.parse(window.localStorage.getItem(`bannersDismissed`));
    if (storage && storage.includes(uniqueBannerID)) {
      setBannerActive(false);
    } else {
      setBannerActive(true);
    }
  }, []);

  useEffect(() => {
    if (width > 1020) {
      document.body.removeAttribute("style");
    }

    if (width < 1020 && drawerOpen) {
      document.body.style.overflow = "hidden";
    }
  }, [drawerOpen, width]);

  useEffect(() => {
    ReactGA.set({
      customBrowserType: !isMobile
        ? "desktop"
        : window["web3"] || window["ethereum"]
        ? "mobileWeb3"
        : "mobileRegular",
    });
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const items: DrawerItem[] = [
    {
      name: "Overview",
      href: "/",
      as: "/",
      icon: EyeOpenIcon,
      className: "overview",
    },
    {
      name: "Orchestrators",
      href: "/orchestrators",
      as: "/orchestrators",
      icon: DNS,
      className: "orchestrators",
    },
    {
      name: (
        <Flex css={{ alignItems: "center" }}>
          Voting{" "}
          {totalActivePolls > 0 && (
            <Flex
              css={{
                fontSize: "10px",
                color: "white",
                ml: "6px",
                bg: "red",
                borderRadius: 1000,
                width: 16,
                height: 16,
                alignItems: "center",
                justifyContent: "center",
              }}>
              {totalActivePolls}
            </Flex>
          )}
        </Flex>
      ),
      href: "/voting",
      as: "/voting",
      icon: Ballot,
      className: "voting",
    },
  ];

  Router.events.on("routeChangeComplete", () =>
    document.body.removeAttribute("style")
  );

  const visibility = drawerOpen ? "visible" : "hidden";
  const onDrawerOpen = () => {
    document.body.style.overflow = "hidden";
    setDrawerOpen(true);
  };
  const onDrawerClose = () => {
    document.body.removeAttribute("style");
    setDrawerOpen(false);
  };
  const lastTx = transactionsData?.txs[transactionsData?.txs?.length - 1];
  const txStartedDialogOpen =
    lastTx?.confirmed === false &&
    !txDialogState.find((t) => t.txHash === lastTx.txHash)?.pendingDialog
      ?.dismissed;
  const txConfirmedDialogOpen =
    lastTx?.confirmed &&
    !txDialogState.find((t) => t.txHash === lastTx.txHash)?.confirmedDialog
      ?.dismissed;

  useOnClickOutside(ref, () => {
    onDrawerClose();
  });
  globalStyles();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Modal
        title="Oops, you’re on the wrong network"
        isOpen={
          context.chainId &&
          networksTypes[context.chainId] !== process.env.NEXT_PUBLIC_NETWORK
        }
        showCloseButton={false}>
        <Box
          css={{
            border: "1px solid",
            borderColor: "$border",
            borderRadius: 10,
            p: "$3",
            mb: "$2",
          }}>
          Simply open MetaMask and switch over to the{" "}
          <Box as="span" css={{ textTransform: "capitalize" }}>
            {process.env.NEXT_PUBLIC_NETWORK}
          </Box>{" "}
          network.
        </Box>
      </Modal>
      <MutationsContext.Provider value={mutations}>
        <Box css={{ height: "calc(100vh - 82px)" }}>
          {data?.protocol.paused && (
            <Flex
              css={{
                py: "$2",
                px: "$2",
                width: "100%",
                alignItems: "center",
                color: "black",
                justifyContent: "center",
                background: "orange",
                fontWeight: 500,
                fontSize: "$3",
              }}>
              The protocol is currently paused.
            </Flex>
          )}
          {bannerActive && (
            <Flex
              css={{
                py: 10,
                display: "none",
                px: "$2",
                width: "100%",
                alignItems: "center",
                bg: "black",
                justifyContent: "center",
                fontSize: "$2",
                position: "relative",
                "@bp2": {
                  display: "flex",
                },
                "@bp3": {
                  fontSize: "$3",
                },
              }}>
              <Box
                as="span"
                css={{
                  mr: "$3",
                  pr: "$3",
                  borderRight: "1px solid",
                  borderColor: "$border",
                }}>
                <Box as="span" css={{ fontWeight: 600 }}>
                  What's New:
                </Box>{" "}
                <Box as="span">Showcasing Network Usage</Box>
              </Box>
              <Link href="/whats-new">
                <Box
                  as="a"
                  css={{
                    minWidth: 94,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: "$primary",
                  }}>
                  Read more <Box as={FiArrowRight} css={{ ml: "$1" }} />
                </Box>
              </Link>

              <Box
                as={FiX}
                onClick={() => {
                  setBannerActive(false);
                  const storage = JSON.parse(
                    window.localStorage.getItem(`bannersDismissed`)
                  );
                  if (storage) {
                    storage.push(uniqueBannerID);
                    window.localStorage.setItem(
                      `bannersDismissed`,
                      JSON.stringify(storage)
                    );
                  } else {
                    window.localStorage.setItem(
                      `bannersDismissed`,
                      JSON.stringify([uniqueBannerID])
                    );
                  }
                }}
                css={{
                  cursor: "pointer",
                  position: "absolute",
                  right: 20,
                  top: 14,
                }}
              />
            </Flex>
          )}

          <Header title={headerTitle} onDrawerOpen={onDrawerOpen} />
          <WalletModal />
          <Box
            css={{
              display: "grid",
              gridTemplateColumns: "100%",
              "@bp3": {
                gridTemplateColumns: "240px 1fr",
              },
            }}>
            <Box
              css={{
                left: 0,
                top: 0,
                position: "fixed",
                width: "100vw",
                height: "calc(100vh)",
                bg: "rgba(0,0,0,.5)",
                visibility,
                zIndex: 100,
                "@bp3": {
                  visibility: "hidden",
                },
              }}
            />
            <Box ref={ref}>
              <Drawer
                onDrawerClose={onDrawerClose}
                onDrawerOpen={onDrawerOpen}
                open={drawerOpen}
                items={items}
              />
            </Box>
            <Flex
              css={{
                position: "relative",
                maxWidth: 1500,
                margin: "0 auto",
                width: "100%",
                px: "$3",
                backgroundColor: "$background",
                "@bp3": {
                  px: "$4",
                },
              }}>
              <Flex css={{ width: "100%" }}>{children}</Flex>
            </Flex>
          </Box>
          <TxConfirmedDialog
            isOpen={txConfirmedDialogOpen}
            onDismiss={() => {
              setTxDialogState([
                ...txDialogState.filter((t) => t.txHash !== lastTx.txHash),
                {
                  ...txDialogState.find((t) => t.txHash === lastTx.txHash),
                  txHash: lastTx.txHash,
                  confirmedDialog: {
                    dismissed: true,
                  },
                },
              ]);
            }}
            tx={lastTx}
          />
          <TxSummaryDialog
            isOpen={txSummaryModalData?.txSummaryModal.open}
            onDismiss={() => {
              client.writeQuery({
                query: gql`
                  query {
                    txSummaryModal {
                      __typename
                      error
                      open
                    }
                  }
                `,
                data: {
                  txSummaryModal: {
                    __typename: "TxSummaryModal",
                    error: false,
                    open: false,
                  },
                },
              });
            }}
          />
          {txStartedDialogOpen && (
            <TxStartedDialog
              isOpen={txStartedDialogOpen}
              onDismiss={() => {
                setTxDialogState([
                  ...txDialogState.filter((t) => t.txHash !== lastTx.txHash),
                  {
                    ...txDialogState.find((t) => t.txHash === lastTx.txHash),
                    txHash: lastTx.txHash,
                    pendingDialog: {
                      dismissed: true,
                    },
                  },
                ]);
              }}
              tx={lastTx}
            />
          )}
          {lastTx?.confirmed === false && (
            <Box
              css={{
                position: "fixed",
                bg: "$surface",
                bottom: 0,
                width: "100%",
                left: 0,
                "@bp1": {
                  width: "calc(100% - 240px)",
                  left: 240,
                },
                "@bp4": {
                  width: "calc(100vw - ((100vw - 1500px) / 2 + 240px))",
                  left: "calc((100% - 1500px) / 2 + 240px)",
                },
              }}>
              <ProgressBar tx={lastTx} />
            </Box>
          )}
        </Box>
      </MutationsContext.Provider>
    </>
  );
};

export const getLayout = (page) => <Layout>{page}</Layout>;

export default Layout;
