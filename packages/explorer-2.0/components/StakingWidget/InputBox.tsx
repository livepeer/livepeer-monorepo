import React from "react";
import { Flex, Box } from "theme-ui";
import Input from "./Input";
import Utils from "web3-utils";
import ReactTooltip from "react-tooltip";

const InputBox = ({
  account,
  action,
  delegator,
  transcoder,
  amount,
  setAmount,
  protocol,
}) => {
  const tokenBalance =
    account && Utils.fromWei(account.tokenBalance.toString());
  const stake = delegator?.pendingStake
    ? Utils.fromWei(delegator.pendingStake)
    : "0";

  return (
    <div
      sx={{
        borderRadius: 16,
        width: "100%",
        border: "1px solid",
        borderColor: "border",
      }}>
      <Box sx={{ px: 2, py: 2 }}>
        <Box>
          <Flex sx={{ fontSize: 0, mb: 2, justifyContent: "space-between" }}>
            <div sx={{ color: "muted" }}>Input</div>

            {account &&
              (action == "stake" ? (
                <div
                  data-tip="Enter max"
                  data-for="balance"
                  onClick={() => setAmount(tokenBalance)}
                  sx={{ cursor: "pointer", color: "muted" }}>
                  <ReactTooltip
                    id="balance"
                    className="tooltip"
                    place="top"
                    type="dark"
                    effect="solid"
                  />
                  Balance:{" "}
                  <span sx={{ fontFamily: "monospace" }}>
                    {parseFloat(tokenBalance)}
                  </span>
                </div>
              ) : (
                <>
                  {+stake > 0 && (
                    <div
                      data-tip="Enter max"
                      data-for="stake"
                      onClick={() => setAmount(stake)}
                      sx={{ cursor: "pointer", color: "muted" }}>
                      <ReactTooltip
                        id="stake"
                        className="tooltip"
                        place="top"
                        type="dark"
                        effect="solid"
                      />
                      Stake:{" "}
                      <span sx={{ fontFamily: "monospace" }}>{+stake}</span>
                    </div>
                  )}
                </>
              ))}
          </Flex>
          <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Input
              transcoder={transcoder}
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAmount(e.target.value ? e.target.value : "")
              }
              protocol={protocol}
            />
          </Flex>
        </Box>
      </Box>
    </div>
  );
};

export default InputBox;
