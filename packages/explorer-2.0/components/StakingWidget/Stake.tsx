import React, { useContext, useState } from "react";
import { useApolloClient } from "@apollo/client";
import Utils from "web3-utils";
import Button from "../Button";
import { MutationsContext } from "../../contexts";
import { initTransaction, MAXIUMUM_VALUE_UINT256 } from "../../lib/utils";
import Box from "../Box";
import ProgressSteps from "../ProgressSteps";

const Stake = ({
  to,
  amount,
  switching,
  tokenBalance,
  transferAllowance,
  delegator,
  reset,
  hint: {
    oldDelegateNewPosPrev,
    oldDelegateNewPosNext,
    currDelegateNewPosPrev,
    currDelegateNewPosNext,
  },
}) => {
  const client = useApolloClient();
  const { bond, approve }: any = useContext(MutationsContext);
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  const amountEntered = amount !== "";
  const sufficientBalance =
    amountEntered && +amount >= 0 && +amount <= tokenBalance;
  const sufficientTransferAllowance =
    amountEntered && transferAllowance > 0 && +amount <= transferAllowance;

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  const showApproveFlow =
    (amountEntered && +amount >= 0 && !sufficientTransferAllowance) ||
    (approvalSubmitted && sufficientTransferAllowance);

  const onApprove = () => {
    const tx = async () => {
      try {
        setApprovalSubmitted(true);
        await approve({
          variables: {
            type: "bond",
            amount: MAXIUMUM_VALUE_UINT256,
          },
        });
      } catch (e) {
        console.log(e);
      }
    };
    initTransaction(client, tx);
  };

  const onStake = () => {
    const tx = async () => {
      await bond({
        variables: {
          amount: Utils.toWei(amount ? amount.toString() : "0"),
          to,
          oldDelegateNewPosPrev,
          oldDelegateNewPosNext,
          currDelegateNewPosPrev,
          currDelegateNewPosNext,
          delegator: delegator?.id,
          lastClaimRound: parseInt(delegator?.lastClaimRound.id, 10),
        },
      });
    };

    initTransaction(client, tx);
    setApprovalSubmitted(false);
    reset();
  };

  if (!amountEntered) {
    return (
      <Button fullWidth disabled>
        Enter an Amount
      </Button>
    );
  }

  if (amountEntered && +amount >= 0 && !sufficientBalance) {
    return (
      <Button fullWidth disabled>
        Insufficient Balance
      </Button>
    );
  }

  if (showApproveFlow) {
    return (
      <Box>
        <Box
          css={{ display: "grid", gap: "$3", gridTemplateColumns: "1fr 1fr" }}>
          <Button
            fullWidth
            color="primary"
            disabled={sufficientTransferAllowance}
            onClick={onApprove}>
            Approve
          </Button>
          <Button
            disabled={!sufficientTransferAllowance}
            color="primary"
            onClick={onStake}
            fullWidth>
            {+amount >= 0 && switching ? "Move Stake" : "Stake"}
          </Button>
        </Box>
        <ProgressSteps
          steps={[sufficientTransferAllowance]}
          css={{ mt: "$3" }}
        />
      </Box>
    );
  }

  return (
    <Button onClick={onStake} fullWidth color="primary">
      {+amount >= 0 && switching ? "Move Stake" : "Stake"}
    </Button>
  );
};

export default Stake;
