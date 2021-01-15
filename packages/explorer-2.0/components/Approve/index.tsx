import { Flex, Box } from "theme-ui";
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
      await approve({
        variables: {
          type: "bond",
          amount: MAXIUMUM_VALUE_UINT256,
        },
      });
    });
  };

  if (account && account.id.toLowerCase() == context.account.toLowerCase()) {
    if (banner) {
      element = (
        <Box sx={{ mb: [3, 3, 3, 4] }}>
          <Banner
            label={
              <Box sx={{ mb: 1 }}>Unlock your Livepeer tokens for staking.</Box>
            }
            button={
              <Flex sx={{ alignSelf: "flex-end" }}>
                <Button
                  onClick={() => setLearnMoreModalOpen(true)}
                  variant="text"
                  sx={{ mr: 2 }}>
                  Learn More
                </Button>
                <Button variant="text" onClick={onClick}>
                  Unlock LPT
                  <Modal
                    title="Unlocking Tokens"
                    showCloseButton
                    isOpen={learnMoreModalOpen}
                    onDismiss={() => setLearnMoreModalOpen(false)}>
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
        <Box sx={{ cursor: "pointer", color: "primary" }} onClick={onClick}>
          Unlock Livepeer tokens for staking.
        </Box>
      );
    }
  }

  return element;
};

export default Index;
