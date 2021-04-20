import { gql, useApolloClient } from "@apollo/client";
import useWindowSize from "react-use/lib/useWindowSize";
import Box from "../Box";

const hoursPerYear = 8760;
const averageHoursPerRound = 21;
const roundsPerYear = hoursPerYear / averageHoursPerRound;

const Input = ({ transcoder, value = "", onChange, protocol, ...props }) => {
  const client = useApolloClient();
  const { width } = useWindowSize();
  const totalSupply = +protocol.totalSupply;
  const totalStaked = +protocol.totalActiveStake;
  const participationRate = +protocol.participationRate;
  const rewardCut =
    transcoder?.rewardCut > 0 ? transcoder?.rewardCut / 1000000 : 0;
  const inflation =
    protocol.inflation > 0 ? protocol.inflation / 1000000000 : 0;
  const inflationChange =
    protocol.inflationChange > 0 ? protocol.inflationChange / 1000000000 : 0;
  const principle = +value ? +value : 0;
  const roi = calculateAnnualROI({
    inflation,
    inflationChange,
    rewardCut,
    principle,
    totalSupply,
    totalStaked,
    participationRate,
  });

  client.writeQuery({
    query: gql`
      query {
        principle
        roi
      }
    `,
    data: {
      principle,
      roi,
    },
  });

  return (
    <Box
      css={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        position: "relative",
      }}
      {...props}>
      <Box
        as="input"
        placeholder="0.0"
        type="number"
        min="0"
        autoFocus={width > 1020}
        value={value}
        onChange={onChange}
        css={{
          backgroundColor: "transparent",
          borderTop: 0,
          borderLeft: 0,
          borderRight: 0,
          borderBottom: 0,
          color: "$text",
          py: 0,
          pl: 0,
          pr: 6,
          boxShadow: "none",
          width: "100%",
          outline: "none",
          fontSize: "$5",
          fontFamily: "$monospace",
          "&::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
          },
          "&::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
          },
        }}
      />
      <Box css={{ fontSize: "$2", right: 0, position: "absolute" }}>LPT</Box>
    </Box>
  );
};

export default Input;

function calculateAnnualROI({
  rewardCut,
  inflation,
  inflationChange,
  principle,
  totalSupply,
  totalStaked,
  participationRate,
}) {
  const percentOfTotalStaked = principle / totalStaked;

  let totalRewardTokens = 0;
  let roi = 0;
  let totalRewardTokensMinusFee;
  let currentMintableTokens;

  for (let i = 0; i < roundsPerYear; i++) {
    currentMintableTokens = totalSupply * inflation;
    totalRewardTokens = percentOfTotalStaked * currentMintableTokens;
    totalRewardTokensMinusFee =
      totalRewardTokens - totalRewardTokens * rewardCut;
    roi += totalRewardTokensMinusFee;
    totalSupply += currentMintableTokens;
    inflation =
      participationRate > 0.5
        ? inflation - inflationChange
        : inflation + inflationChange;
  }
  return roi;
}
