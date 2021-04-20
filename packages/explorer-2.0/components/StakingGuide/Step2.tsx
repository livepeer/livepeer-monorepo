import { useWeb3React } from "@web3-react/core";
import { gql, useApolloClient } from "@apollo/client";
import Box from "../Box";

const Step2 = ({ goTo, nextStep }) => {
  const { active } = useWeb3React();
  const client = useApolloClient();

  if (active) {
    client.writeQuery({
      query: gql`
        query {
          walletModalOpen
        }
      `,
      data: {
        walletModalOpen: false,
      },
    });
    goTo(nextStep);
  }

  return (
    <Box>
      <Box as="h3" css={{ mb: "$3" }}>
        Choose Wallet Provider
      </Box>
      <Box>
        Select your preferred wallet. You can change your selected wallet or
        address later.
      </Box>
    </Box>
  );
};

export default Step2;
