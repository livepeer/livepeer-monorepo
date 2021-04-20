import Box from "../Box";
import Flex from "../Flex";

const Index = ({ value, per }) => {
  return (
    <Flex
      css={{
        justifyContent: "flex-end",
        alignItems: "center",
        fontFamily: "$monospace",
      }}
    >
      {value.toLocaleString()}
      <Box css={{ fontFamily: "$body", ml: "$2", fontSize: 12 }}>WEI</Box>
    </Flex>
  );
};

export default Index;
