import { useContext } from "react";
import Button from "../Button";
import { MAXIUMUM_VALUE_UINT256, initTransaction } from "../../lib/utils";
import { MutationsContext } from "../../contexts";
import { useApolloClient } from "@apollo/client";

const Index = () => {
  const client = useApolloClient();
  const { approve }: any = useContext(MutationsContext);

  const onClick = () => {
    initTransaction(client, async () => {
      try {
        await approve({
          variables: {
            type: "bond",
            amount: MAXIUMUM_VALUE_UINT256,
          },
        });
      } catch (e) {
        console.log(e);
      }
    });
  };

  return (
    <Button color="primary" onClick={onClick}>
      Approve
    </Button>
  );
};

export default Index;
