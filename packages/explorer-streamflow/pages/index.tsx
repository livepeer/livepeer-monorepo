import gql from "graphql-tag";
import { useContext, useEffect, useState } from "react";
import * as React from "react";
import MetaMaskContext from "../lib/metamask";
import PageTitle from "../components/PageTitle";
import { useQuery } from "@apollo/react-hooks";
import Reset from "../lib/reset";
import { jsx, Layout, Header, Main, Container, Footer } from "theme-ui";
import Test from "../components/Test";
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
    ssr: false
  });

  return (
    <Layout>
      <Reset />
      <Main>
        I am a sidebar
        <Container>
          {loading ? "Loading" : <Table transcoders={data.transcoders} />}
        </Container>
      </Main>
      <Footer />
    </Layout>
  );
};
