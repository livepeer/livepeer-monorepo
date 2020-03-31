import useApi from "../../hooks/use-api";
import { Box } from "@theme-ui/components";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { Button } from "@theme-ui/components";
import { Flex } from "@theme-ui/components";

export default () => {
  const { user, token, logout } = useApi();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token]);

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
