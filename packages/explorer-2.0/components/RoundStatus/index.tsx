import Box from "../Box";
import Flex from "../Flex";
import gql from "graphql-tag";
import { useQuery, useApolloClient } from "@apollo/client";
import Modal from "../Modal";
import CircularProgressbar from "../CircularProgressBar";
import { buildStyles } from "react-circular-progressbar";
import moment from "moment";
import { useEffect } from "react";
import { usePageVisibility } from "../../hooks";
import { CheckIcon, Cross1Icon } from "@modulz/radix-icons";
import { theme } from "../../stitches.config";

const GET_ROUND_MODAL_STATUS = gql`
  {
    roundStatusModalOpen @client
  }
`;

const BLOCK_TIME = 13; // ethereum blocks are confirmed on average 13 seconds

const Index = () => {
  const isVisible = usePageVisibility();
  const { data: modalData } = useQuery(GET_ROUND_MODAL_STATUS);
  const pollInterval = 60000;
  const {
    data: protocolData,
    loading: protocolDataloading,
    startPolling: startPollingProtocol,
    stopPolling: stopPollingProtocol,
  } = useQuery(
    gql`
      {
        protocol(id: "0") {
          id
          roundLength
          lastInitializedRound {
            id
          }
          currentRound {
            id
            startBlock
          }
        }
      }
    `,
    {
      pollInterval,
    }
  );
  const {
    data: blockData,
    loading: blockDataLoading,
    startPolling: startPollingBlock,
    stopPolling: stopPollingBlock,
  } = useQuery(
    gql`
      {
        block
      }
    `,
    {
      pollInterval,
    }
  );

  const client = useApolloClient();

  useEffect(() => {
    if (!isVisible) {
      stopPollingProtocol();
      stopPollingBlock();
    } else {
      startPollingProtocol(pollInterval);
      startPollingBlock(pollInterval);
    }
  }, [
    isVisible,
    stopPollingProtocol,
    stopPollingBlock,
    startPollingProtocol,
    startPollingBlock,
  ]);

  const close = () => {
    client.writeQuery({
      query: gql`
        query {
          roundStatusModalOpen
        }
      `,
      data: {
        roundStatusModalOpen: false,
      },
    });
  };

  if (protocolDataloading || blockDataLoading) {
    return null;
  }

  const currentRoundNumber = Math.floor(
    blockData.block.number / protocolData.protocol.roundLength
  );
  const initialized =
    +protocolData.protocol.lastInitializedRound.id === currentRoundNumber;
  const blocksRemaining = initialized
    ? +protocolData.protocol.roundLength -
      (blockData.block.number - +protocolData.protocol.currentRound.startBlock)
    : 0;
  const timeRemaining = BLOCK_TIME * blocksRemaining;
  const blocksSinceCurrentRoundStart = initialized
    ? blockData.block.number - +protocolData.protocol.currentRound.startBlock
    : 0;
  const percentage =
    (blocksSinceCurrentRoundStart / +protocolData.protocol.roundLength) * 100;

  return (
    <Flex
      css={{
        cursor: "pointer",
        py: 10,
        px: "$3",
        fontSize: "$2",
        fontWeight: 600,
        alignItems: "center",
        justifyContent: "center",
        bg: "rgba(255,255,255,.08)",
        borderRadius: "$4",
      }}
      onClick={() =>
        client.writeQuery({
          query: gql`
            query {
              roundStatusModalOpen
            }
          `,
          data: {
            roundStatusModalOpen: true,
          },
        })
      }>
      <Box>
        <Flex
          css={{
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "$monospace",
          }}>
          <Box
            css={{
              width: 16,
              minWidth: 16,
              height: 16,
              minHeight: 16,
              mr: 12,
            }}>
            <CircularProgressbar
              strokeWidth={10}
              styles={buildStyles({
                strokeLinecap: "butt",
                pathColor: theme.colors.primary,
                textColor: theme.colors.text,
                trailColor: theme.colors.lightBlack,
              })}
              value={Math.round(percentage)}
            />
          </Box>
          Round #{currentRoundNumber}
        </Flex>
      </Box>
      <Modal
        showCloseButton={false}
        onDismiss={close}
        isOpen={modalData?.roundStatusModalOpen}
        title={
          <Flex
            css={{
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <Box>Round #{currentRoundNumber}</Box>
            <Flex
              css={{ alignItems: "center", fontSize: "$2", fontWeight: 600 }}>
              Initialized{" "}
              {initialized ? (
                <Box
                  as={CheckIcon}
                  css={{ ml: "$2", width: 20, height: 20, color: "$primary" }}
                />
              ) : (
                <Box
                  as={Cross1Icon}
                  css={{ ml: "$2", width: 20, height: 20, color: "$red" }}
                />
              )}
            </Flex>
          </Flex>
        }>
        <Flex
          css={{
            pb: "$4",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Box
            css={{
              width: 160,
              minWidth: 160,
              height: 160,
              minHeight: 160,
              mr: "$4",
              display: "none",
              "@bp3": {
                display: "block",
              },
            }}>
            <Box
              as={CircularProgressbar}
              strokeWidth={10}
              styles={buildStyles({
                strokeLinecap: "butt",
                pathColor: theme.colors.primary,
                textColor: theme.colors.text,
                trailColor: theme.colors.lightBlack,
              })}
              value={Math.round(percentage)}>
              <Box css={{ textAlign: "center" }}>
                <Box css={{ fontWeight: "bold", fontSize: "$5" }}>
                  {blocksSinceCurrentRoundStart}
                </Box>
                <Box css={{ fontSize: "$1" }}>
                  of {protocolData.protocol.roundLength} blocks
                </Box>
              </Box>
            </Box>
          </Box>
          <Box css={{ lineHeight: 1.5 }}>
            There are{" "}
            <Box
              as="span"
              css={{
                fontWeight: "bold",
                borderBottom: "1px dashed",
                borderColor: "$text",
              }}>
              {blocksRemaining} blocks
            </Box>{" "}
            and approximately{" "}
            <Box
              as="span"
              css={{
                fontWeight: "bold",
                borderBottom: "1px dashed",
                borderColor: "$text",
              }}>
              {moment().add(timeRemaining, "seconds").fromNow(true)}
            </Box>{" "}
            remaining until the current round ends and round{" "}
            <Box
              as="span"
              css={{
                fontWeight: "bold",
                borderBottom: "1px dashed",
                borderColor: "$text",
              }}>
              #{currentRoundNumber + 1}
            </Box>{" "}
            begins.
          </Box>
        </Flex>
      </Modal>
    </Flex>
  );
};

export default Index;
