import React from "react";
import { Box, Spinner } from "@theme-ui/components";
import { Flex } from "theme-ui";
import Button from "../Button";
import Modal from "../Modal";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const Index = ({ isOpen, onDismiss }) => {
  if (!isOpen) {
    return null;
  }

  const GET_TX_SUMMARY_MODAL = gql`
    {
      txSummaryModal @client {
        open
        error
      }
    }
  `;

  const { data } = useQuery(GET_TX_SUMMARY_MODAL);

  return (
    <Modal
      isOpen={isOpen}
      clickAnywhereToClose={false}
      onDismiss={onDismiss}
      title={
        data?.txSummaryModal?.error
          ? "Transaction Error"
          : "Confirm transaction in your wallet"
      }>
      <Box>
        <Header data={data} />
        <Button onClick={() => onDismiss()} sx={{ width: "100%" }}>
          {data?.txSummaryModal?.error ? "Close" : "Cancel"}
        </Button>
      </Box>
    </Modal>
  );
};

export default Index;

function Header({ data }) {
  return (
    <Flex
      sx={{
        border: "1px solid",
        borderColor: "border",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        mb: 3,
      }}>
      <Flex sx={{ fontWeight: 700, alignItems: "center" }}>
        {data?.txSummaryModal?.error ? (
          <Box>There was an error.</Box>
        ) : (
          <>
            <Spinner size={26} sx={{ mr: 2 }} />
            Waiting for confirmation...
          </>
        )}
      </Flex>
    </Flex>
  );
}
