import { useApolloClient, gql } from "@apollo/client";
import Button from "../Button";

const ConnectWallet = () => {
  const client = useApolloClient();

  return (
    <Button
      color="primary"
      size="large"
      onClick={() =>
        client.writeQuery({
          query: gql`
            query {
              walletModalOpen
            }
          `,
          data: {
            walletModalOpen: true,
          },
        })
      }
      css={{ width: "100%" }}>
      Connect Wallet
    </Button>
  );
};

export default ConnectWallet;
