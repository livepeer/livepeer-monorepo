/** @jsx jsx */
import { Styled, jsx, Box } from "theme-ui";
import { useQuery } from "@apollo/react-hooks";
import Button from "../Button";
import { Row } from "./styles";
import gql from "graphql-tag";

const GET_DATA = gql`
  {
    selectedOrchestrator @client {
      id
      rewardCut
      feeShare
    }
    # protocol {
    #   totalTokenSupply
    # }
  }
`;

function calculateAnnualROI(principle) {
  let hoursPerYear = 8760;
  let averageHoursPerRound = 21;
  let totalStaked = 7856714;
  let roundsPerYear = hoursPerYear / averageHoursPerRound;
  let orchestratorRewardCut = 0.01;
  let inflationDelta = 0.000003;
  let totalSupply = 15212264;
  let inflationRate = 0.001544;
  let totalRewardTokens = 0;
  let roi = 0;
  let percentOfTotalStaked = principle / totalStaked;
  let participationRate = totalStaked / totalSupply;
  let totalRewardTokensMinusFee: number;
  let currentMintableTokens: number;

  for (let i = 0; i < roundsPerYear; i++) {
    if (inflationRate < 0) break;
    currentMintableTokens = totalSupply * inflationRate;
    totalRewardTokens = percentOfTotalStaked * currentMintableTokens;
    totalRewardTokensMinusFee =
      totalRewardTokens - totalRewardTokens * orchestratorRewardCut;
    roi = roi + totalRewardTokensMinusFee;
    totalSupply = totalSupply + currentMintableTokens;
    inflationRate =
      participationRate > 0.5
        ? inflationRate - inflationDelta
        : inflationRate + inflationDelta;
  }

  return roi;
}

export default () => {
  const { data } = useQuery(GET_DATA);
  console.log(data);
  calculateAnnualROI(10000);
  return (
    <Box sx={{ px: 4, width: "100%" }}>
      <Styled.h3
        sx={{
          pt: 1,
          pb: 3,
          fontWeight: "bold"
        }}
      >
        ROI Calculator
      </Styled.h3>
      <Styled.div
        sx={{
          borderRadius: 5,
          width: "100%",
          bg: "background",
          mb: 3,
          mt: 4
        }}
      >
        <Styled.h4
          sx={{
            p: 3,
            borderBottom: "1px solid",
            borderColor: "border"
          }}
        >
          Staken
        </Styled.h4>
        <Box sx={{ p: 3 }}>
          <Row
            label="Annual"
            earnings="813.12"
            symbol="LPT"
            percentChange="+13.23%"
          />
        </Box>
      </Styled.div>
      <Box sx={{ mb: 5, p: 3 }}>
        <Row
          sx={{ mb: 4 }}
          label="Monthly"
          earnings="813.12"
          symbol="LPT"
          percentChange="+13.23%"
        />
        <Row
          label="Daily"
          earnings="813.12"
          symbol="LPT"
          percentChange="+13.23%"
        />
      </Box>
      <Button sx={{ width: "100%" }}>Bond</Button>
    </Box>
  );
};
