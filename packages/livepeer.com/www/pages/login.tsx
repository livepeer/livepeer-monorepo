import Layout from "../components/Layout";
import Login from "../components/Login";
import Link from "next/link";
import { Flex, Box } from "@theme-ui/components";
import fetch from "isomorphic-fetch";

export default () => {
  const onSubmit = async ({ email, password }) => {
    const res = await fetch("/api/user/token", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "content-type": "application/json"
      }
    });
    const data = await res.json();
    console.log(data);
  };
  return (
    <Layout>
      <Flex
        sx={{
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          flexDirection: "column"
        }}
      >
        <h3 sx={{ mb: [3, 3] }}>Log in to Livepeer</h3>
        <Login
          onSubmit={onSubmit}
          showEmail={true}
          showPassword={true}
          buttonText="Continue"
        />
        <Box>
          <Link href="/forgot-password">
            <a>Forgot your password?</a>
          </Link>
        </Box>
      </Flex>
    </Layout>
  );
};
