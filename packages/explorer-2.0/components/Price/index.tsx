import Box from "../Box";
import Flex from "../Flex";

const Index = ({ value, css = {} }) => {
  return (
    <Flex
      css={{
        alignItems: "center",
        fontFamily: "$monospace",
        ...css,
      }}>
      {value.toLocaleString()}
      <Box css={{ fontFamily: "$body", ml: "$2", fontSize: 12 }}>WEI</Box>
    </Flex>
  );
};

export default Index;
