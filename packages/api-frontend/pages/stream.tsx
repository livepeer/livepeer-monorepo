/** @jsx jsx */
import { useEffect, useState } from "react";
import { jsx, Flex } from "theme-ui";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import Stream from "../components/Stream";

export default () => {
  const router = useRouter();
  console.log(router.query.url);

  return (
    <Layout>
      <Flex
        sx={{
          flexWrap: "wrap",
          flexGrow: "1",
          flexBasis: "0px",
          padding: 3,
          justifyContent: "center"
        }}
      >
        <Stream id={router.query.url} />
      </Flex>
    </Layout>
  );
};
