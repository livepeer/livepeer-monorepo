import Layout from "../../components/Layout";
import { Flex } from "@theme-ui/components";
import Textfield from "../../components/Textfield";
import { Button, Box } from "@theme-ui/components";
import Link from "next/link";

export default ({ showEmail, showPassword, buttonText }) => (
  <form
    onSubmit={() => {}}
    sx={{
      textAlign: "center",
      width: "100%",
      maxWidth: 958,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      mb: [3, 3]
    }}
  >
    {showEmail && (
      <Textfield
        htmlFor="email"
        id="email"
        sx={{ width: ["100%", "50%"], mb: [3, 3], mx: [1, 3] }}
        name="email"
        type="email"
        label="Email"
        required
      />
    )}
    {showPassword && (
      <Textfield
        htmlFor="password"
        id="password"
        sx={{ width: ["100%", "50%"], mb: [3, 3], mx: [1, 3] }}
        name="password"
        type="password"
        label="Password"
        required
      />
    )}

    <Button sx={{ mt: 4, px: 5 }} variant="primary">
      {buttonText}
    </Button>
  </form>
);
