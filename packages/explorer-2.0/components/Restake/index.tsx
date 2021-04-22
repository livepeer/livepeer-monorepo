import { useContext } from "react";
import Button from "../Button";
import { MutationsContext } from "../../contexts";
import { useApolloClient } from "@apollo/client";
import { initTransaction } from "../../lib/utils";

const Index = ({ unbondingLockId, newPosPrev, newPosNext, delegator }) => {
  const client = useApolloClient();
  const { rebond }: any = useContext(MutationsContext);

  return (
    <>
      <Button
        color="primary"
        onClick={() => {
          initTransaction(client, async () => {
            await rebond({
              variables: {
                unbondingLockId,
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
