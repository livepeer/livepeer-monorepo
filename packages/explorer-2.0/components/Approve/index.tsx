import Box from "../Box";
import Flex from "../Flex";
import { useState, useContext } from "react";
import Button from "../Button";
import Modal from "../Modal";
import { MAXIUMUM_VALUE_UINT256, initTransaction } from "../../lib/utils";
import { useWeb3React } from "@web3-react/core";
import { MutationsContext } from "../../contexts";
import { useApolloClient } from "@apollo/client";

const Index = ({ account }) => {
  const context = useWeb3React();
  const client = useApolloClient();
  const { approve }: any = useContext(MutationsContext);
  const [learnMoreModalOpen, setLearnMoreModalOpen] = useState(false);
  const MDXDocument = require("../../data/unlock-tokens.mdx").default;

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
    <Button
      color="primary"
      onClick={() => {
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
      }}
      css={{ color: "$primary" }}>
      Approve
    </Button>
  );
};

export default Index;
