import React from "react";
import Box from "../Box";
import Flex from "../Flex";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Dialog } from "@reach/dialog";
import { keyframes } from "../../stitches.config";
import CloseIcon from "../../public/img/close.svg";

const rotate = keyframes({
  "100%": { transform: "rotate(360deg)" },
});

const Index = ({ isOpen, onDismiss }) => {
  const GET_TX_SUMMARY_MODAL = gql`
    {
      txSummaryModal @client {
        __typename
        open
        error
      }
    }
  `;

  const { data } = useQuery(GET_TX_SUMMARY_MODAL);

  if (!isOpen) {
    return null;
  }

  return (
    <Box
      as={Dialog}
      aria-label="Dialog"
      isOpen={isOpen}
      onDismiss={() => {
        onDismiss();
      }}
      css={{
        boxShadow: "rgb(0 0 0 / 5%) 0px 4px 8px 0px",
        maxWidth: 430,
        bg: "$surface",
        borderRadius: 16,
        p: "$4",
      }}
    >
      <Flex
        css={{
          justifyContent: "flex-end",
          cursor: "pointer",
          zIndex: 1,
          right: 20,
          top: 20,
          color: "$white",
        }}
      >
        <CloseIcon
          onClick={() => {
            onDismiss();
          }}
        />
      </Flex>
      <Flex
        css={{
          py: "$5",
          flexDirection: "column",
          justifyContent: "flex-start",
          width: "100%",
          alignItems: "center",
          padding: "60px 0px",
        }}
      >
        <Box
          as="img"
          src="/img/green-loader.svg"
          alt="loader"
          css={{
            animation: `${rotate} 2s linear`,
            animationIterationCount: "infinite",
            height: "90px",
            width: "90px",
          }}
        />
      </Flex>
      <Box
        css={{
          display: "grid",
          gridAutoRows: "auto",
          rowGap: "10px",
          justifyItems: "center",
        }}
      >
        <Box css={{ fontSize: "$4", fontWeight: 600 }}>
          Waiting For Confirmation
        </Box>
        <Box css={{ fontSize: "$2" }}>
          {data?.txSummaryModal?.error
            ? "Transaction Error"
            : "Confirm this transaction in your wallet"}
        </Box>
      </Box>
    </Box>
  );
};

export default Index;
