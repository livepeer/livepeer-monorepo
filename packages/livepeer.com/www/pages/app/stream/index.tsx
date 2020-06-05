import useApi from "../../../hooks/use-api";
import { Box } from "@theme-ui/components";
import Layout from "../../../components/Layout";
import { Button } from "@theme-ui/components";
import { Flex } from "@theme-ui/components";
import useLoggedIn from "../../../hooks/use-logged-in";
import StreamsTable from "../../../components/StreamsTable";

export default () => {
  useLoggedIn();
  const { user, logout } = useApi();
  if (!user || user.emailValid === false) {
    return <Layout />;
  }

  return (
    <Layout subnav={true} >
      <Flex
        sx={{
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
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
