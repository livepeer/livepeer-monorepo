import Box from "../components/Box";
import Flex from "../components/Flex";

function Error() {
  return (
    <Flex
      css={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        bg: "$background",
      }}
    >
      <Box
        css={{
          fontSize: "$5",
          pr: "$4",
          mr: "$4",
          borderRight: "1px solid",
          borderColor: "white",
        }}
      >
        404
      </Box>
      <Box>This page could not be found</Box>
    </Flex>
  );
}

export default Error;
