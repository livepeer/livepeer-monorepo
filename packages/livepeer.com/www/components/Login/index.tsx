import Layout from "../../components/Layout";
import { Flex } from "@theme-ui/components";
import Textfield from "../../components/Textfield";
import { Button, Box } from "@theme-ui/components";

export default () => (
  <Layout>
    <form
      onSubmit={() => {}}
      sx={{
        textAlign: "center",
        width: "100%",
        maxWidth: 958,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <h3 sx={{ mb: [3, 3] }}>Log in to Livepeer</h3>
      <Textfield
        htmlFor="email"
        id="email"
        sx={{ width: ["100%", "50%"], mb: [3, 3], mx: [1, 3] }}
        name="email"
        type="email"
        label="Email"
        required
      />
      <Textfield
        htmlFor="password"
        id="password"
        sx={{ width: ["100%", "50%"], mb: [3, 3], mx: [1, 3] }}
        name="password"
        type="password"
        label="Password"
        required
      />

      <Button sx={{ mt: 4, px: 5 }} variant="primary">
        Continue
      </Button>
    </form>
  </Layout>
);
