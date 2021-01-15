import { Styled } from "theme-ui";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

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
    <div>
      <Styled.h2 sx={{ mb: 2 }}>Connect Wallet</Styled.h2>
      <Styled.p>First things first. Let's connect your wallet.</Styled.p>
    </div>
  );
};

export default Step1;
