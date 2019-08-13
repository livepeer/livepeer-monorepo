/** @jsx jsx */
import gql from "graphql-tag";
import { useContext, useEffect, useState } from "react";
import * as React from "react";
import MetaMaskContext from "../lib/metamask";
import PageTitle from "../components/PageTitle";
import { useQuery } from "@apollo/react-hooks";
import { jsx, Flex } from "theme-ui";
import Reset from "../lib/reset";
import Layout from "../components/Layout";
import Table from "../components/Table";
import ROICalculator from "../components/ROICalculator";

const GET_TRANSCODERS = require("../queries/transcoders.graphql");

export default () => {
  // const [accountId, setAccountId] = useState('')
  // const { accounts } = useContext(MetaMaskContext)

  // useEffect(() => {
  //   setAccountId(accounts[0])
  // }, [accounts[0]])

  const { data, loading } = useQuery(GET_TRANSCODERS, {
    notifyOnNetworkStatusChange: true,
    ssr: true
  });

  return (
    <Layout>
      <Reset />
      <Flex sx={{ width: "calc(100% - 256px)" }}>
        {loading ? (
          "Loading"
        ) : (
          <>
            <Flex sx={{ paddingTop: 5, width: "calc(100% - 472px)" }}>
              <Table transcoders={data.transcoders} />
            </Flex>
            <Flex
              sx={{
                paddingTop: 5,
                backgroundColor: "#1E2026",
                maxWidth: 472,
                position: "absolute",
                right: 0,
                height: "100%",
                width: "40%"
              }}
            >
              <ROICalculator />
            </Flex>
          </>
        )}
      </Flex>
    </Layout>
  );
};
