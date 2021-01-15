import { Flex } from "theme-ui";
import { Box } from "theme-ui";
import moment from "moment";
import { useTimeEstimate } from "../../hooks";
import { txMessages } from "../../lib/utils";

const Index = ({ tx }) => {
  if (!tx) {
    return null;
  }
  const { __typename, startTime, estimate, txHash } = tx;
  const { timeLeft } = useTimeEstimate({ startTime, estimate });

  return (
    <Box sx={{ position: "relative", px: 3, pb: 2, pt: "18px" }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: timeLeft
            ? `${((estimate - timeLeft) / estimate) * 100}%`
            : "0%",
          height: 4,
          background:
            "linear-gradient(260.35deg, #F1BC00 0.25%, #E926BE 47.02%, #9326E9 97.86%)",
        }}
      />
      <Flex sx={{ alignItems: "center" }}>
        <Flex
          sx={{
            mr: 2,
            borderRadius: "100%",
            bg: "background",
            color: "white",
            minWidth: 42,
            minHeight: 42,
            justifyContent: "center",
            alignItems: "center",
            fontSize: 0,
            fontWeight: "bold",
          }}>
          {timeLeft
            ? `${
                Math.floor(((estimate - timeLeft) / estimate) * 100) < 100
                  ? Math.floor(((estimate - timeLeft) / estimate) * 100)
                  : "100"
              }%`
            : "0%"}
        </Flex>
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              mb: "4px",
              color: "white",
              fontSize: 1,
              fontWeight: "bold",
            }}>
            {txMessages[__typename]?.pending}
          </Box>
          <Box sx={{ fontSize: 0, color: "muted" }}>
            {timeLeft
              ? `⏳~${moment
                  .duration(timeLeft, "seconds")
                  .humanize()} remaining`
              : "⏳Calculating estimated confirmation duration..."}
          </Box>
        </Box>
        <a
          sx={{ fontSize: 0, justifySelf: "flex-end" }}
          target="_blank"
          rel="noopener noreferrer"
          href={`https://${
            process.env.NEXT_PUBLIC_NETWORK === "rinkeby" ? "rinkeby." : ""
          }etherscan.io/tx/${txHash}`}>
          Details
        </a>
      </Flex>
    </Box>
  );
};

export default Index;
