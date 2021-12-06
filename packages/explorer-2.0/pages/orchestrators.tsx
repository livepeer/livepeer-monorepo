import Box from "../components/Box";
import Flex from "../components/Flex";
import Orchestrators from "../components/Orchestrators";
import { getLayout } from "../layouts/main";
import { NextPage } from "next";
import { withApollo, getStaticApolloProps } from "../apollo";
import Head from "next/head";

type Params = {};
type Props = {};

const OrchestratorsPage = () => {
  return (
    <>
      <Head>
        <title>Livepeer Explorer - Orchestrators</title>
      </Head>
      <Flex css={{ width: "100%" }}>
        <Flex
          css={{
            flexDirection: "column",
            mt: "$4",
            width: "100%",
          }}>
          <Box
            as="h1"
            css={{
              fontSize: "$4",
              mb: "$4",
              fontWeight: 600,
              "@bp2": {
                fontSize: 26,
              },
            }}>
            Top Orchestrators
          </Box>
          <Orchestrators pageSize={30} />
        </Flex>
      </Flex>
    </>
  );
};

OrchestratorsPage.getLayout = getLayout;

export default withApollo({ ssr: false })(OrchestratorsPage as NextPage);

export const getStaticProps = getStaticApolloProps<Props, Params>(
  OrchestratorsPage,
  {
    revalidate: 60,
  }
);
