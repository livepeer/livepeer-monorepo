import { useState } from "react";
import Header from "./Header";
import ProjectionBox from "./ProjectionBox";
import ArrowDown from "../../public/img/arrow-down.svg";
import Footer from "./Footer";
import { Tabs, TabList, Tab } from "./Tabs";
import { Account, Delegator, Transcoder, Protocol, Round } from "../../@types";
import InputBox from "./InputBox";
import Box from "../Box";
import Flex from "../Flex";

interface Props {
  transcoders: [Transcoder];
  transcoder: Transcoder;
  delegator?: Delegator;
  protocol: Protocol;
  account: Account;
  currentRound: Round;
  selectedAction?: string;
}

const Index = ({
  transcoders,
  delegator,
  account,
  transcoder,
  protocol,
  currentRound,
  selectedAction = "stake",
}: Props) => {
  const [amount, setAmount] = useState();
  const [action, setAction] = useState(selectedAction);

  return (
    <Box className="tour-step-7">
      <Box
        css={{
          width: "100%",
          boxShadow:
            "rgba(0, 0, 0, 0.03) 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 4px 8px, rgba(0, 0, 0, 0.06) 0px 16px 24px, rgba(0, 0, 0, 0.03) 0px 24px 32px",
          borderTopRightRadius: "$6",
          borderTopLeftRadius: "$6",
          backgroundColor: "$surface",
          "@bp3": {
            borderBottomRightRadius: "$6",
            borderBottomLeftRadius: "$6",
          },
        }}>
        <Header transcoder={transcoder} />
        <Box css={{ pt: "$2", pb: "$3", px: "$3" }}>
          <Tabs
            defaultIndex={selectedAction === "stake" ? 0 : 1}
            onChange={(index: number) =>
              setAction(index ? "unstake" : "stake")
            }>
            <TabList>
              <Tab>Stake</Tab>
              <Tab>Unstake</Tab>
            </TabList>
          </Tabs>

          <InputBox
            account={account}
            action={action}
            delegator={delegator}
            transcoder={transcoder}
            amount={amount}
            setAmount={setAmount}
            protocol={protocol}
          />
          <Flex
            css={{
              alignItems: "center",
              justifyContent: "center",
              width: "95%",
              height: 32,
              margin: "0 auto",
            }}>
            <ArrowDown css={{ width: 16, color: "rgba(255, 255, 255, .8)" }} />
          </Flex>
          <ProjectionBox action={action} />
          <Footer
            data={{
              transcoders,
              currentRound,
              account,
              delegator,
              transcoder,
              action,
              amount,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Index;
