/** @jsx jsx */
import gql from "graphql-tag";
import { useContext, useEffect, useState } from "react";
import * as React from "react";
import MetaMaskContext from "../lib/metamask";
import { useQuery } from "@apollo/react-hooks";
import { jsx, Flex } from "theme-ui";
import Layout from "../components/Layout";
import Table from "../components/Table";
import ROICalculator from "../components/ROICalculator";

const GET_TRANSCODERS = require("../queries/transcoders.graphql");

const ROICalculatorContainer = ({ children }) => {
  return (
    <Flex
      sx={{
        paddingTop: 4,
        backgroundColor: "#1E2026",
        maxWidth: 472,
        position: "fixed",
        top: 0,
        right: 0,
        height: "100%",
        width: "40%",
        "&:after": {
          opacity: 0,
          content: '""',
          position: "absolute",
          width: "0",
          height: "0",
          borderStyle: "solid",
          borderWidth: "12px 28px 12px 0",
          borderColor: "transparent #1f2026 transparent transparent",
          left: "-28px",
          top: "151px"
        }
      }}
    >
      {children}
    </Flex>
  );
};

export default () => {
  const { data, loading } = useQuery(GET_TRANSCODERS, {
    notifyOnNetworkStatusChange: true,
    ssr: true
  });

  if (loading) {
    return (
      <Layout>
        <Flex
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          Loading...
        </Flex>
      </Layout>
    );
  }
  return (
    <Layout>
      <Flex sx={{ width: "calc(100% - 256px)" }}>
        <>
          <Flex sx={{ paddingTop: 4, pr: 4, width: "calc(100% - 472px)" }}>
            <Table transcoders={data.transcoders} />
          </Flex>
          <ROICalculatorContainer>
            <ROICalculator />
          </ROICalculatorContainer>
        </>
      </Flex>
    </Layout>
  );
};
