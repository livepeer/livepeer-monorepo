import Box from "../Box";
import Flex from "../Flex";
import { useState, useContext } from "react";
import Button from "../Button";
import Modal from "../Modal";
import { MAXIUMUM_VALUE_UINT256, initTransaction } from "../../lib/utils";
import Banner from "../Banner";
import { useWeb3React } from "@web3-react/core";
import { MutationsContext } from "../../contexts";
import { useApolloClient } from "@apollo/client";

const Index = ({ account, banner = true }) => {
  const context = useWeb3React();
  const client = useApolloClient();
  const { approve }: any = useContext(MutationsContext);
  const [learnMoreModalOpen, setLearnMoreModalOpen] = useState(false);
  const MDXDocument = require("../../data/unlock-tokens.mdx").default;

  let element = null;

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

  if (account && account.id.toLowerCase() === context.account.toLowerCase()) {
    if (banner) {
      element = (
        <Box
          css={{
            mb: "$4",
            "@bp3": {
              mb: "$5",
            },
          }}
        >
          <Banner
            label={
              <Box css={{ mb: "$3" }}>
                Unlock your Livepeer tokens for staking.
              </Box>
            }
            button={
              <Flex css={{ alignSelf: "flex-end" }}>
                <Button
                  size="small"
                  outline
                  onClick={() => setLearnMoreModalOpen(true)}
                  css={{ mr: "$3" }}
                >
                  Learn More
                </Button>
                <Button color="primary" size="small" onClick={onClick}>
                  Unlock LPT
                  <Modal
                    title="Unlocking Tokens"
                    showCloseButton
                    isOpen={learnMoreModalOpen}
                    onDismiss={() => setLearnMoreModalOpen(false)}
                  >
                    <MDXDocument />
                  </Modal>
                </Button>
              </Flex>
            }
          />
        </Box>
      );
    } else {
      element = (
        <Box css={{ cursor: "pointer", color: "$primary" }} onClick={onClick}>
          Unlock Livepeer tokens for staking.
        </Box>
      );
    }
  }

  return element;
};

export default Index;
