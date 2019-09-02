/** @jsx jsx */
import gql from "graphql-tag";
import { useContext, useEffect, useState } from "react";
import * as React from "react";
// import MetaMaskContext from "../lib/metamask";
import { useQuery } from "@apollo/react-hooks";
import { jsx, Flex, Box } from "theme-ui";
// import Layout from "@livepeer/explorer-streamflow/dist/components/Layout";
// import Table from "../components/Table";
// import ROICalculator from "../components/ROICalculator";

// const GET_DATA = require("../queries/transcoders.graphql");

export default () => {
  // const { data, loading } = useQuery(GET_DATA, {
  //   notifyOnNetworkStatusChange: true,
  //   ssr: false
  // });
  // const loading = useState(false);

  // if (loading) {
  //   return (
  //     <Layout>
  //       <Flex
  //         sx={{
  //           width: "100%",
  //           justifyContent: "center",
  //           alignItems: "center"
  //         }}
  //       >
  //         Loading...
  //       </Flex>
  //     </Layout>
  //   );
  // }
  return (
    <Flex>
      <Box>hi</Box>
    </Flex>
  );
  // return (
  //   <Layout>
  //     <Flex>Loaded!</Flex>
  //   </Layout>
  // );
};
