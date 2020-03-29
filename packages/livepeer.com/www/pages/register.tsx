import Layout from "../components/Layout";
import Login from "../components/Login";
import Link from "next/link";
import { Flex, Box } from "@theme-ui/components";
import { useState } from "react";

export default () => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    const res = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "content-type": "application/json"
      }
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) {
      setErrors([data.error]);
    }
    if (data.errors) {
      setErrors(data.errors);
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
        <h3 sx={{ mb: [3, 3] }}>Create an Account</h3>
        <Login
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
