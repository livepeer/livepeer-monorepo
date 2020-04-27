import { Flex } from "@theme-ui/components";
import { Box } from "@theme-ui/components";

export default ({ children }) => {
  return (
    <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
      <Box
        sx={{
          maxWidth: 958,
          padding: 3
        }}
      >
        {children}
      </Box>
    </Flex>
  );
};
