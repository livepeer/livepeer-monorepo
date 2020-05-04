import useApi from "../../hooks/use-api";
import { Box } from "@theme-ui/components";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import { Button } from "@theme-ui/components";
import { Flex } from "@theme-ui/components";
import useLoggedIn from "../../hooks/use-logged-in";
import TokenTable from "../../components/TokenTable";
import StreamsTable from "../../components/StreamsTable";

export default () => {
  useLoggedIn();
  const { user, logout } = useApi();
  if (!user) {
    return <Layout />;
  }

  return (
    <Layout>
      <Flex
        sx={{
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <TokenTable id="API Token Table" userId={user.id} />
        <StreamsTable id="Streams Table" userId={user.id} />
        <Box sx={{ margin: 3 }}>
          <Button variant="outline" onClick={logout}>
            Log Out
          </Button>
        </Box>
      </Flex>
    </Layout>
  );
};
