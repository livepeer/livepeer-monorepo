import Layout from "../components/Layout";
import Login from "../components/Login";
import Link from "next/link";
import { Flex, Box } from "@theme-ui/components";
import { useState } from "react";

export default () => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const onSubmit = ({ email }) => {
    console.log(`should reset password for`, { email });
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
        <h3 sx={{ mb: [3, 3] }}>Reset your password</h3>
        <Login
          showEmail={true}
          showPassword={false}
          buttonText="Get reset link"
          onSubmit={onSubmit}
          errors={errors}
          loading={loading}
        />
        <Box>
          Nevermind!&nbsp;
          <Link href="/login">
            <a>Take me back to log in</a>
          </Link>
        </Box>
      </Flex>
    </Layout>
  );
};
