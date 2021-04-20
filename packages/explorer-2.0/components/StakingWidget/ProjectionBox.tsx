import Box from "../Box";
import Flex from "../Flex";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { abbreviateNumber } from "../../lib/utils";

const ProjectionBox = ({ action }) => {
  const GET_ROI = gql`
    {
      roi @client
      principle @client
    }
  `;

  const { data } = useQuery(GET_ROI);

  return (
    <Box
      css={{
        borderRadius: 16,
        width: "100%",
        border: "1px solid",
        borderColor: "$border",
        mb: "$3",
      }}
    >
      <Box css={{ px: "$3", py: "$3" }}>
        <Box>
          <Flex
            css={{
              fontSize: "$1",
              mb: "$3",
              justifyContent: "space-between",
            }}
          >
            <Box css={{ color: "$muted" }}>
              {action === "stake"
                ? "Projected Rewards (1Y)"
                : "Projected Opportunity Cost (1Y)"}
            </Box>
            {action === "stake" && (
              <Box css={{ fontFamily: "$monospace", color: "$muted" }}>
                +
                {data.principle
                  ? ((data.roi / +data.principle) * 100).toFixed(2) + "%"
                  : 0 + "%"}
              </Box>
            )}
          </Flex>
          <Flex css={{ justifyContent: "space-between", alignItems: "center" }}>
            <Box css={{ fontSize: "$5", fontFamily: "$monospace" }}>
              +{abbreviateNumber(data.roi)}
            </Box>
            <Box css={{ fontSize: "$2" }}>LPT</Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectionBox;
