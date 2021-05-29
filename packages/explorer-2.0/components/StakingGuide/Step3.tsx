import Box from "../Box";
import { useQuery, gql } from "@apollo/client";

const Step3 = ({ goTo, nextStep }) => {
  const GET_UNISWAP_MODAL_STATUS = gql`
    {
      uniswapModalOpen @client
    }
  `;

  const { data } = useQuery(GET_UNISWAP_MODAL_STATUS);
  if (data?.uniswapModalOpen) {
    goTo(nextStep);
  }

  return (
    <Box>
      <Box as="h3" css={{ mb: "$3" }}>
        Get LPT
      </Box>
      <Box>
        You'll need LPT to stake. Let's swap some ETH for LPT on Uniswap.
      </Box>
    </Box>
  );
};

export default Step3;
