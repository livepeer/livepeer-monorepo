import { useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import Button from "../Button";
import { MutationsContext } from "../../contexts";
import { useApolloClient } from "@apollo/client";
import { initTransaction } from "../../lib/utils";

const Index = ({
  unbondingLockId,
  delegate,
  newPosPrev,
  newPosNext,
  delegator,
}) => {
  const context = useWeb3React();
  const client = useApolloClient();
  const { rebondFromUnbonded }: any = useContext(MutationsContext);

  if (!context.active) {
    return null;
  }

  return (
    <>
      <Button
        color="primary"
        onClick={() => {
          initTransaction(client, async () => {
            await rebondFromUnbonded({
              variables: {
                unbondingLockId,
                delegate,
                newPosPrev,
                newPosNext,
                delegator: delegator?.id,
                lastClaimRound: parseInt(delegator?.lastClaimRound.id, 10),
              },
            });
          });
        }}
        css={{ py: "$2", mr: "$3" }}
      >
        Restake
      </Button>
    </>
  );
};

export default Index;
