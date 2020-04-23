import Textfield from "../../components/Textfield";
import { Button, Box } from "@theme-ui/components";
import { useState } from "react";
import hash from "@livepeer/api/dist/hash";

// The frontend salts are all the same. This could be configurable someday.
export const FRONTEND_SALT = "69195A9476F08546";

export default ({
  id,
  showEmail,
  showPassword,
  buttonText,
  onSubmit,
  loading,
  errors
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        if (!showPassword) {
          return onSubmit({ email });
        }
        const [hashedPassword] = await hash(password, FRONTEND_SALT);
        // hash password, then
        onSubmit({ email, password: hashedPassword });
      }}
      sx={{
        textAlign: "center",
        width: "100%",
        maxWidth: 958,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: [3, 3]
      }}
      id={id}
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
          value={email}
          onChange={e => setEmail(e.target.value)}
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
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      )}

      <Box>{errors.join(", ")}&nbsp;</Box>

      <Button sx={{ mt: 4, px: 5 }} variant="primary">
        {loading ? "Loading..." : buttonText}
      </Button>
    </form>
  );
};
