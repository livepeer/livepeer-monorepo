import { useQuery } from "@apollo/client";
import Orchestrators from "../components/Orchestrators";
import { useWeb3React } from "@web3-react/core";
import { getLayout } from "../layouts/main";
import { NextPage } from "next";
import Approve from "../components/Approve";
import Search from "../components/Search";
import Utils from "web3-utils";
import { useEffect } from "react";
import { usePageVisibility } from "../hooks";
import accountQuery from "../queries/account.gql";
import OrchestratorPayouts from "../components/OrchestratorPayouts";
import Link from "next/link";
import { withApollo, getStaticApolloProps } from "../apollo";
import GlobalChart from "../components/GlobalChart";
import Flickity from "react-flickity-component";
import Box from "../components/Box";
import Flex from "../components/Flex";

type Params = {};
type Props = {};

const Panel = ({ children }) => (
  <Flex
    css={{
      minHeight: 350,
      height: 350,
      position: "relative",
      backgroundColor: "$background",
      p: "24px",
      marginRight: 16,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      border: "1px solid",
      borderColor: "$border",
      boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.05)",
      width: "100%",
      "@bp2": {
        width: "43%",
      },
    }}>
    <Box css={{ borderColor: "$border" }} />
    {children}
  </Flex>
);

const Home = () => {
  const context = useWeb3React();
  const isVisible = usePageVisibility();
  const pollInterval = 20000;

  const {
    data: dataMyAccount,
    startPolling: startPollingMyAccount,
    stopPolling: stopPollingMyAccount,
  } = useQuery(accountQuery, {
    variables: {
      account: context?.account?.toLowerCase(),
    },
    pollInterval,
    skip: !context.active,
  });

  useEffect(() => {
    if (!isVisible) {
      stopPollingMyAccount();
    } else {
      startPollingMyAccount(pollInterval);
    }
  }, [isVisible, stopPollingMyAccount, startPollingMyAccount]);

  const flickityOptions = {
    wrapAround: true,
    cellAlign: "left",
    prevNextButtons: false,
  };

  return (
    <>
      <Flex css={{ width: "100%" }}>
        <Flex
          css={{
            flexDirection: "column",
            mt: "$3",
            width: "100%",
            "@bp3": {
              mt: "$4",
            },
          }}>
          {context.active && (
            <Box>
              {dataMyAccount &&
                parseFloat(Utils.fromWei(dataMyAccount.account.allowance)) ===
                  0 &&
                parseFloat(
                  Utils.fromWei(dataMyAccount.account.tokenBalance)
                ) !== 0 && (
                  <Approve account={dataMyAccount.account} banner={true} />
                )}
            </Box>
          )}
          <Box
            as="h1"
            css={{
              color: "white",
              fontSize: "$3",
              fontWeight: 600,
              mb: 22,
              display: "none",
              alignItems: "center",
              "@bp2": {
                fontSize: 26,
              },
              "@bp3": {
                display: "flex",
              },
            }}>
            Protocol Explorer
          </Box>
          <Search />
          <Box
            css={{
              mb: "$5",
              boxShadow: "inset -20px 0px 20px -20px rgb(0 0 0 / 70%)",
            }}>
            <Flickity
              className={"flickity"}
              elementType={"div"}
              options={flickityOptions}
              disableImagesLoaded={true} // default false
              reloadOnUpdate
              static>
              <Panel>
                <GlobalChart
                  display="volume"
                  title="Estimated Usage (7d)"
                  field="weeklyUsageMinutes"
                  unit="minutes"
                />
              </Panel>
              <Panel>
                <GlobalChart
                  display="volume"
                  title="Fee Volume (7d)"
                  field="weeklyVolumeUSD"
                  unit="usd"
                />
              </Panel>
              <Panel>
                <GlobalChart
                  display="area"
                  title="Participation"
                  field="participationRate"
                />
              </Panel>
            </Flickity>
          </Box>
          <Box css={{ mb: "$3" }}>
            <Flex
              css={{
                justifyContent: "space-between",
                mb: "$2",
                alignItems: "center",
              }}>
              <Box as="h2" css={{ fontWeight: 500, fontSize: 18 }}>
                Top Orchestrators
              </Box>
              <Link href="/orchestrators" passHref>
                <Box as="a" css={{ color: "$white", fontSize: "$2", pr: "$3" }}>
                  See All
                </Box>
              </Link>
            </Flex>
            <Orchestrators />
          </Box>
          <Box>
            <Flex
              css={{
                justifyContent: "space-between",
                mb: "$2",
                alignItems: "center",
              }}>
              <Box as="h2" css={{ fontWeight: 500, fontSize: 18 }}>
                Orchestrator Payouts
              </Box>
            </Flex>
            <OrchestratorPayouts />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

Home.getLayout = getLayout;

export default withApollo({ ssr: false })(Home as NextPage);

export const getStaticProps = getStaticApolloProps<Props, Params>(Home, {
  revalidate: 10,
});
