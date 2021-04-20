import { useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import Button from "../Button";
import { MutationsContext } from "../../contexts";
import { useApolloClient } from "@apollo/client";
import { initTransaction } from "../../lib/utils";

const Index = ({ unbondingLockId }) => {
  const context = useWeb3React();
  const client = useApolloClient();
  const { withdrawStake }: any = useContext(MutationsContext);

  if (!context.active) {
    return null;
  }

  return (
    <>
      <Button
        color="primary"
        onClick={() => {
          initTransaction(client, async () => {
            await withdrawStake({
              variables: {
                unbondingLockId,
              },
            });
          });
        }}
        css={{ py: "$2", mr: "$3" }}
      >
        Withdraw
      </Button>
    </>
  );
};

export default Index;
