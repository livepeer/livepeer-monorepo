import { useContext } from "react";
import Utils from "web3-utils";
import Button from "../Button";
import { useWeb3React } from "@web3-react/core";
import { MutationsContext } from "../../contexts";
import { useApolloClient } from "@apollo/client";
import { initTransaction } from "../../lib/utils";

const Unstake = ({ amount, newPosPrev, newPosNext, delegator, disabled }) => {
  const context = useWeb3React();
  const client = useApolloClient();
  const { unbond }: any = useContext(MutationsContext);

  if (!context.active) {
    return null;
  }

  return (
    <>
      <Button
        disabled={disabled}
        variant="red"
        onClick={() => {
          initTransaction(client, async () => {
            try {
              await unbond({
                variables: {
                  amount: Utils.toWei(amount ? amount.toString() : "0"),
                  newPosPrev,
                  newPosNext,
                  delegator: delegator?.id,
                  lastClaimRound: parseInt(delegator?.lastClaimRound.id, 10),
                },
              });
            } catch (err) {
              console.log(err);
            }
          });
        }}
        sx={{ width: "100%" }}>
        Unstake
      </Button>
    </>
  );
};

export default Unstake;
