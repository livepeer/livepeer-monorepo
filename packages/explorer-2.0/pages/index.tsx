import { Flex, Styled } from "theme-ui";
import { useQuery } from "@apollo/client";
import Orchestrators from "../components/Orchestrators";
import { useWeb3React } from "@web3-react/core";
import { getLayout } from "../layouts/main";
import { NextPage } from "next";
import { Box } from "theme-ui";
import Approve from "../components/Approve";
import Search from "../components/Search";
import Utils from "web3-utils";
import { useEffect } from "react";
import { usePageVisibility } from "../hooks";
import accountQuery from "../queries/account.gql";
import GlobalChart from "../components/GlobalChart";
import OrchestratorPayouts from "../components/OrchestratorPayouts";
import Link from "next/link";
import { withApollo, getStaticApolloProps } from "../apollo";
import Flickity from "react-flickity-component";

type Params = {};
type Props = {};

const Panel = ({ children }) => (
  <Box
    sx={{
      minHeight: 350,
      height: 350,
      position: "relative",
      backgroundColor: "rgba(255,255,255,.01)",
      padding: 3,
      width: ["100%", "100%", "43%"],
      marginRight: 16,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      border: "1px solid",
      borderColor: "border",
      boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.05)",
    }}>
    {children}
  </Box>
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
  }, [isVisible]);

  const flickityOptions = {
    wrapAround: true,
    cellAlign: "left",
    prevNextButtons: false,
  };

  return (
    <>
      <Flex sx={{ width: "100%" }}>
        <Flex
          sx={{
            flexDirection: "column",
            mt: [3, 3, 3, 5],
            width: "100%",
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
          <Styled.h1
            sx={{
              color: "white",
              fontSize: [3, 3, 26],
              fontWeight: 600,
              mb: 22,
              display: ["none", "none", "none", "flex"],
              alignItems: "center",
            }}>
            Protocol Explorer
          </Styled.h1>
          <Search pushSx={{ mb: 5 }} />
          <Box
            sx={{
              mb: 5,
              boxShadow: "inset -20px 0px 20px -20px rgb(0 0 0 / 70%)",
            }}>
            <Flickity
              className={"carousel"}
              elementType={"div"}
              options={flickityOptions}
              disableImagesLoaded={true} // default false
              reloadOnUpdate
              static>
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
                  display="volume"
                  title="Estimated Usage (7d)"
                  field="weeklyUsageMinutes"
                  unit="minutes"
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
          <Box sx={{ mb: 3 }}>
            <Flex
              sx={{
                justifyContent: "space-between",
                mb: 2,
                alignItems: "center",
              }}>
              <Styled.h2 sx={{ fontWeight: 500, fontSize: 18 }}>
                Top Orchestrators
              </Styled.h2>
              <Link href="/orchestrators" passHref>
                <a sx={{ fontSize: 1, pr: 3 }}>See All</a>
              </Link>
            </Flex>
            <Orchestrators />
          </Box>
          <Box>
            <Flex
              sx={{
                justifyContent: "space-between",
                mb: 2,
                alignItems: "center",
              }}>
              <Styled.h2 sx={{ fontWeight: 500, fontSize: 18 }}>
                Orchestrator Payouts
              </Styled.h2>
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
