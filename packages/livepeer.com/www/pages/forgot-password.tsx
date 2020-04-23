import Layout from "../components/Layout";
import Login from "../components/Login";
import Link from "next/link";
import { Flex, Box } from "@theme-ui/components";
import { useState } from "react";
import { useApi, useLoggedIn } from "../hooks";

export default () => {
  useLoggedIn(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { makePasswordResetToken } = useApi();
  const onSubmit = async ({ email }) => {
    setLoading(true);
    setErrors([]);
    const res = await makePasswordResetToken(email);
    if (res.errors) {
      setLoading(false);
      setErrors(res.errors);
    } else {
      setSuccess(true)
    }
  };
  if (success) {
    return (
      <Layout>
        <Flex
          sx={{
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            flexDirection: "column"
          }}
        >Password reset link sent to your email.</Flex>
      </Layout>
    );
  }
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
          id="forgot-password"
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
