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
      <Flex sx={{ marginTop: 5, width: "calc(100% - 268px)" }}>
        {loading ? (
          "Loading"
        ) : (
          <>
            <Flex sx={{ width: "60%" }}>
              <Table transcoders={data.transcoders} />
            </Flex>
            <Flex sx={{ width: "40%" }}>calculator</Flex>
          </>
        )}
      </Flex>
    </Layout>
  );
};
