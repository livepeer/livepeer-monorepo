import Box from "../components/Box";
import Flex from "../components/Flex";
import { useQuery } from "@apollo/client";
import Orchestrators from "../components/Orchestrators";
import { useWeb3React } from "@web3-react/core";
import { getLayout } from "../layouts/main";
import Approve from "../components/Approve";
import Utils from "web3-utils";
import { useEffect } from "react";
import { usePageVisibility } from "../hooks";
import accountQuery from "../queries/account.gql";
import { NextPage } from "next";
import { withApollo, getStaticApolloProps } from "../apollo";
import Head from "next/head";

type Params = {};
type Props = {};

const OrchestratorsPage = () => {
  const context = useWeb3React();
  const isVisible = usePageVisibility();
  const pollInterval = 30000;

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

  return (
    <>
      <Head>
        <title>Livepeer Explorer - Orchestrators</title>
      </Head>
      <Flex css={{ width: "100%" }}>
        <Flex
          css={{
            flexDirection: "column",
            mt: "$4",
            width: "100%",
          }}
        >
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
              fontSize: "$4",
              mb: "$4",
              fontWeight: 600,
              "@bp2": {
                fontSize: 26,
              },
            }}
          >
            Top Orchestrators
          </Box>
          <Orchestrators pageSize={30} />
        </Flex>
      </Flex>
    </>
  );
};

OrchestratorsPage.getLayout = getLayout;

export default withApollo({ ssr: false })(OrchestratorsPage as NextPage);

export const getStaticProps = getStaticApolloProps<Props, Params>(
  OrchestratorsPage,
  {
    revalidate: 10,
  }
);
