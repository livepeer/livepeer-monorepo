import Layout from "../components/Layout";
import Login from "../components/Login";
import Link from "next/link";
import { Flex, Box } from "@theme-ui/components";

export default () => (
  <Layout>
    <Flex
      sx={{
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        flexDirection: "column"
      }}
    >
      <h3 sx={{ mb: [3, 3] }}>Create an Account</h3>
      <Login showEmail={true} showPassword={true} buttonText="Continue" />
      <Box>
        Already have an account?!&nbsp;
        <Link href="/login">
          <a>Log in</a>
        </Link>
      </Box>
    </Flex>
  </Layout>
);
