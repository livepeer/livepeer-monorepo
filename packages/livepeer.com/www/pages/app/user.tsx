import useApi from "../../hooks/use-api";
import { Box } from "@theme-ui/components";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import { Button } from "@theme-ui/components";
import { Flex } from "@theme-ui/components";
import useLoggedIn from "../../hooks/use-logged-in";

export default () => {
  useLoggedIn();
  const { user, logout } = useApi();
  if (!user) {
    return <Layout />;
  }

  return (
    <Layout>
      <Box>Logged in as {user && user.email}</Box>
      <Button onClick={logout}>Log out</Button>
    </Layout>
  );
};
