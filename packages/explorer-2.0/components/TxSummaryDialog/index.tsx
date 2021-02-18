import React from "react";
import { Box } from "@theme-ui/components";
import { Flex } from "theme-ui";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Dialog } from "@reach/dialog";
import { keyframes } from "@emotion/react";
import CloseIcon from "../../public/img/close.svg";

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

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
    <Dialog
      aria-label="Dialog"
      isOpen={isOpen}
      onDismiss={() => {
        onDismiss();
      }}
      sx={{
        boxShadow: "rgb(0 0 0 / 5%) 0px 4px 8px 0px",
        maxWidth: 430,
        bg: "surface",
        borderRadius: 16,
        p: 4,
      }}>
      <Flex sx={{ justifyContent: "flex-end" }}>
        <CloseIcon
          onClick={() => {
            onDismiss();
          }}
          sx={{
            cursor: "pointer",
            zIndex: 1,
            right: 20,
            top: 20,
            color: "white",
          }}
        />
      </Flex>
      <Flex
        sx={{
          py: 5,
          flexDirection: "column",
          justifyContent: "flex-start",
          width: "100%",
          alignItems: "center",
          padding: "60px 0px",
        }}>
        <img
          src="/img/green-loader.svg"
          alt="loader"
          sx={{
            animation: `${rotate} 2s linear`,
            animationIterationCount: "infinite",
            height: "90px",
            width: "90px",
          }}
        />
      </Flex>
      <Box
        sx={{
          display: "grid",
          gridAutoRows: "auto",
          rowGap: "10px",
          justifyItems: "center",
        }}>
        <Box sx={{ fontSize: 3, fontWeight: 600 }}>
          Waiting For Confirmation
        </Box>
        <Box sx={{ fontSize: 1 }}>
          {data?.txSummaryModal?.error
            ? "Transaction Error"
            : "Confirm this transaction in your wallet"}
        </Box>
      </Box>
    </Dialog>
  );
};

export default Index;
