import { Dialog } from "@reach/dialog";
import { useApolloClient, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import useWindowSize from "react-use/lib/useWindowSize";
import { keyframes } from "../../stitches.config";
import Box from "../Box";

const slideUp = keyframes({
  "0%": { transform: "translate3d(0, 100%, 0)" },
  "100%": { transform: "translate3d(0,0%,0)" },
});

const Index = ({ children }) => {
  const client = useApolloClient();
  const { width } = useWindowSize();

  const GET_BOTTOM_DRAWER_STATUS = gql`
    {
      bottomDrawerOpen @client
    }
  `;

  const { data } = useQuery(GET_BOTTOM_DRAWER_STATUS);

  return (
    <Box
      as={Dialog}
      aria-label="Bottom Drawer"
      isOpen={data?.bottomDrawerOpen && width < 1020}
      css={{
        animation: `${slideUp} 0.3s ease`,
        position: "fixed",
        bottom: 0,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        maxWidth: "100%",
        width: "100%",
        margin: 0,
        border: 0,
      }}
      onDismiss={() =>
        client.writeQuery({
          query: gql`
            query {
              bottomDrawerOpen
            }
          `,
          data: {
            bottomDrawerOpen: false,
          },
        })
      }>
      {children}
    </Box>
  );
};

export default Index;
