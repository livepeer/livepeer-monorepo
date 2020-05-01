import Layout from "../components/Layout";
import Login from "../components/Login";
import Link from "next/link";
import { Flex, Box } from "@theme-ui/components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useApi from "../hooks/use-api";

export default () => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { register, user } = useApi();

  useEffect(() => {
    if (user) {
      router.replace("/app/user");
    }
  }, [user]);

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    setErrors([]);
    const res = await register(email, password);
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
          flexDirection: "column"
        }}
      >
        <Box
          sx={{
            mb: [5, 5],
            mt: [6, 6],
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          <Box sx={{ mb: 3 }}>
            Sign up to try Livepeer’s transcoding platform, and qualify for a
            free forever plan.
          </Box>
          <Box>
            Livepeer’s free forever plan will give you 1,000 free transcoding
            input minutes per month forever.
          </Box>
        </Box>

        <h3 sx={{ mb: [3, 3] }}>Create an Account</h3>
        <Login
          id="register"
          onSubmit={onSubmit}
          showEmail={true}
          showPassword={true}
          buttonText="Continue"
          loading={loading}
          errors={errors}
        />
        <Box>
          Already have an account?&nbsp;
          <Link href="/login">
            <a>Log in</a>
          </Link>
        </Box>
      </Flex>
    </Layout>
  );
};
