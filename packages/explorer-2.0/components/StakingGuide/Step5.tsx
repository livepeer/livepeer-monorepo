import { useEffect, useContext } from "react";
import Box from "../Box";
import Button from "../Button";
import { usePageVisibility } from "../../hooks";
import Router from "next/router";
import { MAXIUMUM_VALUE_UINT256 } from "../../lib/utils";
import { useWeb3React } from "@web3-react/core";
import { MutationsContext } from "../../contexts";
import { useQuery } from "@apollo/client";
import accountQuery from "../../queries/account.gql";

const Step5 = ({ goTo, nextStep }) => {
  const context = useWeb3React();
  const isVisible = usePageVisibility();
  const pollInterval = 20000;
  const { approve }: any = useContext(MutationsContext);
  const { data: dataMyAccount, startPolling, stopPolling } = useQuery(
    accountQuery,
    {
      variables: {
        account: context?.account?.toLowerCase(),
      },
      pollInterval,
      skip: !context.active, // skip this query if wallet not connected
      ssr: false,
    }
  );

  useEffect(() => {
    if (!isVisible) {
      stopPolling();
    } else {
      startPolling(pollInterval);
    }
  }, [isVisible, stopPolling, startPolling]);

  useEffect(() => {
    async function goToNextStep() {
      if (dataMyAccount.account.allowance !== "0") {
        await Router.push("/");
        goTo(nextStep);
      }
    }
    goToNextStep();
  }, [dataMyAccount.account.allowance, goTo, nextStep]);

  return (
    <Box css={{ py: "$2" }}>
      <Box as="h3" css={{ mb: "$3" }}>
        Approve Livepeer Tokens
      </Box>
      <Box>
        Allow Livepeer smart contracts to transfer Livepeer tokens on your
        behalf?
      </Box>

      <Button
        onClick={async () => {
          try {
            await approve({
              variables: {
                type: "bond",
                amount: MAXIUMUM_VALUE_UINT256,
              },
            });
          } catch (e) {
            return {
              error: e.message.replace("GraphQL error: ", ""),
            };
          }
        }}
        css={{ position: "absolute", right: 30, bottom: 16 }}>
        Approve LPT
      </Button>
    </Box>
  );
};

export default Step5;
