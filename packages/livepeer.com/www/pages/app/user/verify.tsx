import useApi from "../../../hooks/use-api";
import { Box, Flex } from "@theme-ui/components";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { Button } from "@theme-ui/components";

const Container = ({ children }) => (
  <Layout>
    <Flex sx={{ flexGrow: 1, alignItems: "center", justifyContent: "center" }}>
      <Box>{children}</Box>
    </Flex>
  </Layout>
);

export default () => {
  const router = useRouter();
  const { verify, user, logout } = useApi();
  const { email, emailValidToken } = router.query;

  useEffect(() => {
    if (email && emailValidToken) {
      verify(email, emailValidToken).then(() => {
        router.replace("/app/user");
      });
    }
  }, [email, emailValidToken]);

//   If they've already validated their email, get 'em out of here
  useEffect(() => {
    if (user && user.emailValid !== false) {
      router.replace("/app/user");
    }
  }, [user]);

  if (email && emailValidToken) {
    return <Container>Verifying...</Container>;
  }
  return (
    <Container>
      <p>Please check your email for a verification link.</p>
      <Button variant="outline" onClick={logout}>
        Log Out
      </Button>
    </Container>
  );
};
