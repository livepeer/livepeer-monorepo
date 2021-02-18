import React from "react";
import { Box } from "@theme-ui/components";
import { Flex } from "theme-ui";
import Button from "../Button";
import Modal from "../Modal";
import { txMessages } from "../../lib/utils";
import Verified from "../../public/img/verified.svg";
import { MdReceipt } from "react-icons/md";
import Utils from "web3-utils";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import Router from "next/router";

const Index = ({ tx, isOpen, onDismiss }) => {
  const { width, height } = useWindowSize();

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      clickAnywhereToClose={false}
      onDismiss={onDismiss}
      title="Confirmed"
      Icon={<Verified sx={{ color: "primary" }} />}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 4,
          background:
            "linear-gradient(260.35deg, #F1BC00 0.25%, #E926BE 47.02%, #9326E9 97.86%)",
        }}
      />
      {renderSwitch({ tx, onDismiss, width, height })}
    </Modal>
  );
};

export default Index;

function renderSwitch({ tx, onDismiss, width, height }) {
  const inputData = JSON.parse(tx.inputData);

  switch (tx.__typename) {
    case "bond":
      return (
        <Box>
          <Confetti
            canvasRef={React.createRef()}
            width={width}
            height={height}
          />
          <Table sx={{ mb: 3 }}>
            <Header tx={tx} />
            <Box sx={{ px: 2, py: 3 }}>
              <Box>
                Congrats! You've successfully staked{" "}
                {Utils.fromWei(inputData.amount)} LPT.
              </Box>
            </Box>
          </Table>
          <Button onClick={() => onDismiss()} sx={{ width: "100%" }}>
            Close
          </Button>
        </Box>
      );
    case "unbond":
      return (
        <Box>
          <Table sx={{ mb: 3 }}>
            <Header tx={tx} />
            <Box sx={{ px: 2, py: 3 }}>
              <Box>
                You've successfully unstaked {Utils.fromWei(inputData.amount)}{" "}
                LPT. The unstaking period is ~7 days after which you may
                withdraw the unstaked LPT into your wallet.
              </Box>
            </Box>
          </Table>
          <Button onClick={() => onDismiss()} sx={{ width: "100%" }}>
            Close
          </Button>
        </Box>
      );
    case "approve":
      return (
        <Box>
          <Table sx={{ mb: 3 }}>
            <Header tx={tx} />
            <Box sx={{ px: 2, py: 3 }}>
              {inputData.type === "createPoll" ? (
                <Box>Nice one! You may now proceed with creating a poll.</Box>
              ) : (
                <Box>Nice one! You may now proceed with staking LPT.</Box>
              )}
            </Box>
          </Table>
          <Button onClick={() => onDismiss()} sx={{ width: "100%" }}>
            Close
          </Button>
        </Box>
      );
    case "rebond":
      return (
        <Box>
          <Table sx={{ mb: 3 }}>
            <Header tx={tx} />
            <Box sx={{ px: 2, py: 3 }}>Successfully restaked.</Box>
          </Table>
          <Button onClick={() => onDismiss()} sx={{ width: "100%" }}>
            Close
          </Button>
        </Box>
      );
    case "rebondFromUnbonded":
      return (
        <Box>
          <Table sx={{ mb: 3 }}>
            <Header tx={tx} />
            <Box sx={{ px: 2, py: 3 }}>
              You've successfully restaked to delegate{" "}
              {tx.inputData &&
                inputData.delegate.replace(
                  inputData.delegate.slice(7, 37),
                  "…"
                )}
            </Box>
          </Table>
          <Button onClick={() => onDismiss()} sx={{ width: "100%" }}>
            Close
          </Button>
        </Box>
      );
    case "vote":
      return (
        <Box>
          <Table sx={{ mb: 3 }}>
            <Header tx={tx} />
            <Box sx={{ px: 2, py: 3 }}>
              You've successfully casted a vote{" "}
              {tx.inputData && inputData.choiceId === 0 ? '"Yes"' : '"No"'}
            </Box>
          </Table>
          <Button onClick={() => onDismiss()} sx={{ width: "100%" }}>
            Close
          </Button>
        </Box>
      );
    case "batchClaimEarnings":
      return (
        <Box>
          <Table sx={{ mb: 3 }}>
            <Header tx={tx} />
            <Box sx={{ px: 2, py: 3 }}>
              Successfully claimed {tx.inputData && inputData.totalRounds}{" "}
              rounds
            </Box>
          </Table>
          <Button onClick={() => onDismiss()} sx={{ width: "100%" }}>
            Close
          </Button>
        </Box>
      );
    case "createPoll":
      return (
        <Box>
          <Confetti
            canvasRef={React.createRef()}
            width={width}
            height={height}
          />
          <Table sx={{ mb: 3 }}>
            <Header tx={tx} />
            <Box sx={{ px: 2, py: 3 }}>
              Nice one! You've successfully created a poll. Head on over to the{" "}
              <a
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  onDismiss();
                  Router.push("/voting");
                }}>
                voting dashboard
              </a>{" "}
              to view your newly created poll.
            </Box>
          </Table>
          <Button onClick={() => onDismiss()} sx={{ width: "100%" }}>
            Close
          </Button>
        </Box>
      );
    case "withdrawStake":
      return (
        <Box>
          <Table sx={{ mb: 3 }}>
            <Header tx={tx} />
            <Box sx={{ px: 2, py: 3 }}>Successfully withdrawn stake.</Box>
          </Table>
          <Button onClick={() => onDismiss()} sx={{ width: "100%" }}>
            Close
          </Button>
        </Box>
      );
    case "withdrawFees":
      return (
        <Box>
          <Table sx={{ mb: 3 }}>
            <Header tx={tx} />
            <Box sx={{ px: 2, py: 3 }}>Successfully withdrawn fees.</Box>
          </Table>
          <Button onClick={() => onDismiss()} sx={{ width: "100%" }}>
            Close
          </Button>
        </Box>
      );
    default:
      return null;
  }
}

function Table({ children, ...props }) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "border",
        borderRadius: 10,
      }}
      {...props}>
      {children}
    </Box>
  );
}

function Header({ tx }) {
  return (
    <Flex
      sx={{
        borderBottom: "1px solid",
        borderColor: "border",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
      }}>
      <Flex sx={{ fontWeight: 700, alignItems: "center" }}>
        <Box sx={{ mr: "10px" }}>🎉</Box>
        {txMessages[tx?.__typename]?.confirmed}
      </Flex>
      <a
        sx={{ display: "flex", alignItems: "center" }}
        target="_blank"
        rel="noopener noreferrer"
        href={`https://${
          process.env.NEXT_PUBLIC_NETWORK === "rinkeby" ? "rinkeby." : ""
        }etherscan.io/tx/${tx?.txHash}`}>
        Transfer Receipt <MdReceipt sx={{ ml: "6px", color: "primary" }} />
      </a>
    </Flex>
  );
}
