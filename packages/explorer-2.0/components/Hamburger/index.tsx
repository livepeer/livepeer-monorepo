import Box from "../Box";
import Flex from "../Flex";

const Index = ({ ...props }) => {
  return (
    <Flex
      css={{
        cursor: "pointer",
        flexDirection: "column",
        justifyContent: "center",
        mr: "$3",
      }}
      {...props}
    >
      <Box css={{ mb: "5px", bg: "white", height: "1px", width: "20px" }} />
      <Box css={{ mb: "5px", bg: "white", height: "1px", width: "16px" }} />
      <Box css={{ bg: "white", height: "1px", width: "20px" }} />
    </Flex>
  );
};

export default Index;
