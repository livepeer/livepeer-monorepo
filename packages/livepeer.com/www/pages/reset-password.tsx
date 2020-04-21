import Layout from "../components/Layout";
import Login from "../components/Login";
import Link from "next/link";
import { Flex, Box } from "@theme-ui/components";
import { useState } from "react";
import { useApi, useLoggedIn } from "../hooks";
import { useRouter } from "next/router";

export default () => {
  useLoggedIn(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useApi();
  const router = useRouter();
  const { email, resetToken } = router.query;

  const onSubmit = async ({ password }) => {
    setLoading(true);
    setErrors([]);
    const res = await resetPassword(email, resetToken, password);
    // Don't need to worry about the success case, we'll redirect
    if (res.errors) {
      setLoading(false);
      setErrors(res.errors);
    }
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
          showEmail={false}
          showPassword={true}
          buttonText="Change password"
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
