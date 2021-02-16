import { useWeb3React } from "@web3-react/core";
import Button from "../Button";
import { useContext } from "react";
import { MutationsContext } from "../../contexts";
import { useApolloClient } from "@apollo/client";
import { initTransaction } from "../../lib/utils";

const Index = ({ pollAddress, choiceId, children, ...props }) => {
  const context = useWeb3React();
  const client = useApolloClient();
  const { vote }: any = useContext(MutationsContext);

  if (!context.active) {
    return null;
  }

  return (
    <Button
      onClick={() => {
        initTransaction(client, async () => {
          await vote({ variables: { pollAddress, choiceId } });
        });
      }}
      {...props}>
      {children}
    </Button>
  );
};

export default Index;
