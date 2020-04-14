import Layout from "../components/Layout";
import Login from "../components/Login";
import Link from "next/link";
import { Flex, Box } from "@theme-ui/components";
import { useState, useEffect } from "react";
import useApi from "../hooks/use-api";
import { useRouter } from "next/router";

export default () => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, token, login } = useApi();

  useEffect(() => {
    if (user) {
      router.replace("/app/user");
    }
  }, [user]);

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    setErrors([]);
    const res = await login(email, password);
    // Don't need to worry about the success case, we'll redirect
    if (res.errors) {
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
          flexDirection: "column",
          mx: [3, 0]
        }}
      >
        <h3 sx={{ mb: [3, 3] }}>Log in to Livepeer</h3>
        <Login
          onSubmit={onSubmit}
          showEmail={true}
          showPassword={true}
          buttonText="Continue"
          errors={errors}
          loading={loading}
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
