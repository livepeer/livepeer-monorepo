import Textfield from "../../components/Textfield";
import { Button, Box } from "@theme-ui/components";
import { useState } from "react";

export default ({ showEmail, showPassword, buttonText, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        if (!showPassword) {
          onSubmit({ email });
        }
        // hash password, then
        onSubmit({ email, password });
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

      <Button sx={{ mt: 4, px: 5 }} variant="primary">
        {buttonText}
      </Button>
    </form>
  );
};
