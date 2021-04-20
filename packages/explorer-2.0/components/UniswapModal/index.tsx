import { Dialog } from "@reach/dialog";
import { useApolloClient, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Cross1Icon } from "@modulz/radix-icons";
import Box from "../Box";

const Index = ({ children }) => {
  const client = useApolloClient();
  const GET_UNISWAP_MODAL_STATUS = gql`
    {
      uniswapModalOpen @client
    }
  `;

  const { data } = useQuery(GET_UNISWAP_MODAL_STATUS);
  const close = () => {
    client.writeQuery({
      query: gql`
        query {
          uniswapModalOpen
        }
      `,
      data: {
        uniswapModalOpen: false,
      },
    });
  };

  return (
    <Dialog
      onDismiss={close}
      isOpen={data?.uniswapModalOpen}
      aria-label="Uniswap"
      style={{
        display: "flex",
        alignItems: "center",
        maxWidth: 600,
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <Box
        as={Cross1Icon}
        onClick={close}
        css={{
          cursor: "pointer",
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 1000,
          color: "white",
        }}
      />
      {children}
    </Dialog>
  );
};

export default Index;
