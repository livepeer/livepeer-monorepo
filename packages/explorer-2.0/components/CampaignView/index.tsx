import Box from "../Box";
import Flex from "../Flex";
import Card from "../Card";
import { abbreviateNumber, expandedPriceLabels } from "../../lib/utils";
import ReactTooltip from "react-tooltip";
import { useRef, useState } from "react";
import Price from "../Price";
import {
  Menu,
  MenuItemRadioGroup,
  MenuItemRadio,
} from "@modulz/radix/dist/index.es";
import { CheckIcon, Cross1Icon } from "@modulz/radix-icons";
import HelpIcon from "../HelpIcon";

const Subtitle = ({ css = {}, children }) => {
  return (
    <Box
      css={{
        fontSize: "$4",
        color: "$text",
        fontWeight: 500,
        fontFamily: "$monospace",
        "@bp2": {
          fontSize: "$5",
        },
        ...css,
      }}>
      {children}
    </Box>
  );
};

const Index = ({ currentRound, transcoder }) => {
  const [isPriceSettingOpen, setIsPriceSettingOpen] = useState(false);
  const targetRef = useRef();
  const [priceSetting, setPriceSetting] = useState("pixel");
  const callsMade = transcoder.pools.filter((r) => r.rewardTokens != null)
    .length;

  const PriceSettingToggle = () => (
    <Box
      as="span"
      ref={targetRef}
      onClick={(e) => {
        e.stopPropagation();
        setIsPriceSettingOpen(true);
      }}
      css={{
        cursor: "pointer",
        fontSize: 12,
      }}>
      <Box as="span" css={{ mx: "4px" }}>
        /
      </Box>
      <Box
        as="span"
        title={`Price of transcoding per ${expandedPriceLabels[priceSetting]}`}
        css={{
          color: "$text",
        }}>
        {priceSetting}
      </Box>
    </Box>
  );
  return (
    <Box css={{ pt: "$4" }}>
      <Box
        as={Menu}
        css={{
          background: "$surface",
          p: 0,
          boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
        }}
        isOpen={isPriceSettingOpen}
        onClose={() => setIsPriceSettingOpen(false)}
        buttonRef={targetRef}>
        <MenuItemRadioGroup
          value={priceSetting}
          onChange={(value) => {
            setPriceSetting(value);
          }}>
          <MenuItemRadio value="pixel" label="1 pixel" />
          <MenuItemRadio value="1m pixels" label="1 million pixels" />
          <MenuItemRadio value="1b pixels" label="1 billion pixels" />
          <MenuItemRadio value="1t pixels" label="1 trillion pixels" />
        </MenuItemRadioGroup>
      </Box>
      <Box
        css={{
          display: "grid",
          gridGap: "$3",
          gridTemplateColumns: "repeat(auto-fit, minmax(33%, 1fr))",
          "@bp3": {
            gridTemplateColumns: "repeat(auto-fit, minmax(30%, 1fr))",
          },
        }}>
        <Card
          css={{ flex: 1 }}
          title="Total Stake"
          subtitle={
            <Subtitle>
              {abbreviateNumber(transcoder.totalStake, 4)}
              <Box as="span" css={{ ml: "$2", fontSize: "$2" }}>
                LPT
              </Box>
            </Subtitle>
          }
        />
        <Card
          css={{ flex: 1 }}
          title="Earned Fees"
          subtitle={
            <Subtitle>
              {transcoder.totalVolumeETH
                ? abbreviateNumber(transcoder.totalVolumeETH, 3)
                : 0}
              <Box as="span" css={{ ml: "$2", fontSize: 12 }}>
                ETH
              </Box>
            </Subtitle>
          }
        />
        <Card
          title="Reward Calls"
          subtitle={
            <Subtitle css={{ display: "flex", alignItems: "center" }}>
              {callsMade}/{transcoder.pools.length}
            </Subtitle>
          }
        />
        <Card
          css={{ flex: 1 }}
          title="Reward Cut"
          subtitle={
            <Subtitle>
              {!transcoder.rewardCut
                ? 0
                : parseInt(transcoder.rewardCut, 10) / 10000}
              %
            </Subtitle>
          }
        />
        <Card
          css={{ flex: 1 }}
          title="Fee Cut"
          subtitle={
            <Subtitle>
              {!transcoder.feeShare
                ? 0
                : 100 - parseInt(transcoder.feeShare, 10) / 10000}
              %
            </Subtitle>
          }
        />
        <Card
          css={{ flex: 1 }}
          title={
            <Flex css={{ alignItems: "center" }}>
              <Box>
                Price
                <PriceSettingToggle />
              </Box>
              <Flex>
                <ReactTooltip
                  id="tooltip-price"
                  className="tooltip-price"
                  place="top"
                  type="dark"
                  effect="solid"
                  getContent={() => {
                    return `Price of transcoding per ${expandedPriceLabels[priceSetting]}`;
                  }}
                />
                <HelpIcon data-tip="" data-for="tooltip-price" />
              </Flex>
            </Flex>
          }
          subtitle={
            <Subtitle>
              {transcoder.price <= 0 ? (
                "N/A"
              ) : (
                <Price value={transcoder.price} per={priceSetting} />
              )}
            </Subtitle>
          }
        />
        {transcoder?.lastRewardRound?.id && (
          <Card
            css={{ flex: 1 }}
            title={
              <Flex css={{ alignItems: "center" }}>
                <Box css={{ color: "$muted" }}>Last Reward Round</Box>
                <Flex>
                  <ReactTooltip
                    id="tooltip-last-reward-round"
                    className="tooltip"
                    place="top"
                    type="dark"
                    effect="solid"
                  />
                  <HelpIcon
                    data-tip="The last round that an orchestrator received rewards while active. A checkmark indicates it called reward for the current round."
                    data-for="tooltip-last-reward-round"
                  />
                </Flex>
              </Flex>
            }
            subtitle={
              <Subtitle>
                <Flex css={{ alignItems: "center" }}>
                  {transcoder.lastRewardRound.id}{" "}
                  {transcoder.active && (
                    <Flex>
                      {transcoder.lastRewardRound.id === currentRound.id ? (
                        <Box
                          as={CheckIcon}
                          css={{ fontSize: "$3", color: "$primary", ml: "$2" }}
                        />
                      ) : (
                        <Box
                          as={Cross1Icon}
                          css={{ fontSize: "$2", color: "$red", ml: "$2" }}
                        />
                      )}
                    </Flex>
                  )}
                </Flex>
              </Subtitle>
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default Index;
