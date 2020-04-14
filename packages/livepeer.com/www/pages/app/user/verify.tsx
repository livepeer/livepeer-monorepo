import useApi from "../../../hooks/use-api";
import { Box } from "@theme-ui/components";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { Button } from "@theme-ui/components";
import { Flex } from "@theme-ui/components";

export default () => {
  const router = useRouter();
  console.log(router.query);
  const { verify } = useApi();
  const email = router.query.email;
  const emailValidToken = router.query.emailValidToken;

  useEffect(() => {
    if ((!email || !emailValidToken)) {
      router.replace("/login");
      return
    }
    verify(email, emailValidToken).then(() => {
        router.replace("/app/user")
    })
  }, [email, emailValidToken]);

  return (
    <Layout>
      <Box>Hello!</Box>
    </Layout>
  );
};
