import React, { useCallback, useContext, useState } from "react";
import { gql, useApolloClient } from "@apollo/client";
import Utils from "web3-utils";
import Button from "../Button";
import { useWeb3React } from "@web3-react/core";
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

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  // useEffect(() => {
  //   if (approval === ApprovalState.PENDING) {
  //     setApprovalSubmitted(true);
  //   }
  // }, [approval, approvalSubmitted]);

  // const handleInputSelect = useCallback((inputCurrency) => {
  //   setApprovalSubmitted(false); // reset 2 step UI for approvals
  // }, []);

  console.log("wat", amountEntered);
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
            onClick={() => {
              initTransaction(client, async () => {
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
              });
            }}>
            Approve
          </Button>
          <Button
            disabled={!sufficientTransferAllowance}
            color="primary"
            onClick={() => {
              initTransaction(client, async () => {
                try {
                  await bond({
                    variables: {
                      amount: Utils.toWei(amount ? amount.toString() : "0"),
                      to,
                      oldDelegateNewPosPrev,
                      oldDelegateNewPosNext,
                      currDelegateNewPosPrev,
                      currDelegateNewPosNext,
                      delegator: delegator?.id,
                      lastClaimRound: parseInt(
                        delegator?.lastClaimRound.id,
                        10
                      ),
                    },
                  });
                } catch (err) {
                  console.log(err);
                }
                // If user staked inside tour, close tour after staking
                client.writeQuery({
                  query: gql`
                    query {
                      tourOpen
                    }
                  `,
                  data: {
                    tourOpen: false,
                  },
                });
              });
            }}
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
    <Button
      onClick={() => {
        initTransaction(client, async () => {
          try {
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
          } catch (err) {
            console.log(err);
          }
          // If user staked inside tour, close tour after staking
          client.writeQuery({
            query: gql`
              query {
                tourOpen
              }
            `,
            data: {
              tourOpen: false,
            },
          });
        });
      }}
      fullWidth
      color="primary">
      {+amount >= 0 && switching ? "Move Stake" : "Stake"}
    </Button>
  );
};

export default Stake;
