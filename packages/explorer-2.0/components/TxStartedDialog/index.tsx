import Box from "../Box";
import Flex from "../Flex";
import Button from "../Button";
import Modal from "../Modal";
import { useTimeEstimate } from "../../hooks";
import { txMessages } from "../../lib/utils";
import Utils from "web3-utils";
import moment from "moment";
import Spinner from "../Spinner";
import { ExternalLinkIcon } from "@modulz/radix-icons";

const Index = ({ tx, isOpen, onDismiss }) => {
  const { timeLeft } = useTimeEstimate({
    startTime: tx?.startTime,
    estimate: tx?.estimate,
  });

  return (
    <Modal
      isOpen={isOpen}
      clickAnywhereToClose={false}
      onDismiss={onDismiss}
      title="Sending"
      Icon={<Spinner />}>
      <Box
        css={{
          position: "absolute",
          top: 0,
          left: 0,
          width: timeLeft
            ? `${((tx?.estimate - timeLeft) / tx?.estimate) * 100}%`
            : "0%",
          height: 4,
          background:
            "linear-gradient(260.35deg, #F1BC00 0.25%, #E926BE 47.02%, #9326E9 97.86%)",
        }}
      />

      <Box
        css={{
          borderRadius: 10,
          border: "1px solid",
          borderColor: "$border",
          mb: "$4",
        }}>
        <Header tx={tx} timeLeft={timeLeft} />
        <Box
          css={{
            p: "$3",
          }}>
          {Table({ tx, timeLeft })}
        </Box>
      </Box>

      <Button onClick={() => onDismiss()} css={{ width: "100%" }}>
        Close
      </Button>
    </Modal>
  );
};

export default Index;

function Table({ tx, timeLeft }) {
  return (
    <Box>
      <Row>
        <Box>Your account</Box> {tx.from.replace(tx.from.slice(7, 37), "…")}
      </Row>
      <Inputs tx={tx} />
      <Row css={{ mb: 0 }}>
        <Box>Estimated wait</Box>
        <Box>
          {timeLeft
            ? `~${moment.duration(timeLeft, "seconds").humanize()} remaining`
            : "Estimating..."}
        </Box>
      </Row>
    </Box>
  );
}

function Inputs({ tx }) {
  const inputData = JSON.parse(tx.inputData);
  switch (tx.__typename) {
    case "bond":
      return (
        <>
          <Row>
            <Box>Delegate</Box>{" "}
            {inputData && inputData.to.replace(inputData.to.slice(7, 37), "…")}
          </Row>

          <Row>
            <Box>Amount</Box> {tx.inputData && Utils.fromWei(inputData.amount)}{" "}
            LPT
          </Row>
        </>
      );
    case "unbond":
      return (
        <>
          <Row>
            <Box>Amount</Box> {tx.inputData && Utils.fromWei(inputData.amount)}{" "}
            LPT
          </Row>
        </>
      );
    case "rebondFromUnbonded":
      return (
        <>
          <Row>
            <Box>Delegate</Box>{" "}
            {tx.inputData &&
              inputData.delegate.replace(inputData.delegate.slice(7, 37), "…")}
          </Row>
        </>
      );
    case "vote":
      return (
        <>
          <Row>
            <Box>Vote</Box>{" "}
            {tx.inputData && inputData.choiceId === 0 ? "Yes" : "No"}
          </Row>
        </>
      );
    case "batchClaimEarnings":
      return (
        <>
          <Row>
            <Box>Total Rounds</Box> {tx.inputData && inputData.totalRounds}
          </Row>
        </>
      );
    case "createPoll":
      return null;
    case "withdrawStake":
      return null;
    case "withdrawFees":
      return null;
    case "rebond":
      return null;
    case "approve":
      return null;
    default:
      return null;
  }
}

function Row({ css = {}, children, ...props }) {
  return (
    <Flex
      css={{
        mb: "$3",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "$2",
        "&:last-of-type": {
          mb: 0,
        },
        ...css,
      }}
      {...props}>
      {children}
    </Flex>
  );
}

function Header({ css = {}, tx, timeLeft }) {
  return (
    <Flex
      css={{
        borderBottom: "1px solid",
        borderColor: "$border",
        p: "$3",
        alignItems: "center",
        justifyContent: "space-between",
        ...css,
      }}>
      <Flex
        css={{
          mr: "$3",
          color: "white",
          fontSize: "$1",
          fontWeight: "bold",
        }}>
        {timeLeft
          ? `${
              Math.floor(((tx?.estimate - timeLeft) / tx?.estimate) * 100) < 100
                ? Math.floor(((tx?.estimate - timeLeft) / tx?.estimate) * 100)
                : "100"
            }%`
          : "0%"}
      </Flex>
      <Box css={{ fontWeight: 700 }}>{txMessages[tx?.__typename]?.pending}</Box>
      <Box
        as="a"
        css={{ display: "flex", alignItems: "center" }}
        target="_blank"
        rel="noopener noreferrer"
        href={`https://${
          process.env.NEXT_PUBLIC_NETWORK === "rinkeby" ? "rinkeby." : ""
        }etherscan.io/tx/${tx?.txHash}`}>
        Details{" "}
        <Box as={ExternalLinkIcon} css={{ ml: "6px", color: "$primary" }} />
      </Box>
    </Flex>
  );
}
