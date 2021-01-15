import Button from "../Button";
import { MAXIUMUM_VALUE_UINT256, initTransaction } from "../../lib/utils";
import { useContext } from "react";
import { MutationsContext } from "../../contexts";
import { useApolloClient } from "@apollo/client";

const Index = () => {
  const client = useApolloClient();
  const { approve }: any = useContext(MutationsContext);

  return (
    <>
      <Button
        onClick={() => {
          initTransaction(client, async () => {
            await approve({
              variables: { type: "createPoll", amount: MAXIUMUM_VALUE_UINT256 },
            });
          });
        }}>
        Unlock LPT for poll creation
      </Button>
    </>
  );
};

export default Index;
