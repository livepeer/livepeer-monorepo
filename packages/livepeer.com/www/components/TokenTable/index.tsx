import { useEffect, useState, Fragment } from "react";
import { useApi } from "../../hooks";
import { Box, Button } from "@theme-ui/components";

export default ({ userId }) => {
  const [tokens, setTokens] = useState([]);
  const { getApiTokens } = useApi();
  useEffect(() => {
    getApiTokens(userId).then(tokens => setTokens(tokens));
  }, [userId]);
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 958,
        mb: [3, 3],
        mx: "auto"
      }}
    >
      <p>
        <strong>Note:</strong> These tokens allow other apps to control your
        whole account. Treat them like you would a password.
      </p>
      <Box>
        <Button>Create</Button>
        <Button>Delete</Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto"
        }}
      >
        <Box></Box>
        <Box>Name</Box>
        <Box>Last Active</Box>
        {["Token One", "Token Two", "Token Three"].map((name, i) => (
          <Fragment key={i}>
            <Box>x</Box>
            <Box>{name}</Box>
            <Box>2m ago</Box>
          </Fragment>
        ))}
      </Box>
    </Box>
  );
};
