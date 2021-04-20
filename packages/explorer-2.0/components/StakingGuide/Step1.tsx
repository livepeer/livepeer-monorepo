import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Box from "../Box";

const Step1 = ({ goTo, nextStep }) => {
  const GET_WALLET_MODAL_STATUS = gql`
    {
      walletModalOpen @client
    }
  `;

  const { data } = useQuery(GET_WALLET_MODAL_STATUS);
  if (data?.walletModalOpen) {
    goTo(nextStep);
  }

  return (
    <Box>
      <Box as="h3" css={{ mb: "$3" }}>
        Connect Wallet
      </Box>
      <Box>First things first. Let's connect your wallet.</Box>
    </Box>
  );
};

export default Step1;
