import { Flex, Box } from "theme-ui";

const Index = ({ ...props }) => {
  return (
    <Flex
      sx={{
        cursor: "pointer",
        flexDirection: "column",
        justifyContent: "center",
      }}
      {...props}>
      <Box sx={{ mb: "5px", bg: "white", height: "1px", width: "20px" }} />
      <Box sx={{ mb: "5px", bg: "white", height: "1px", width: "16px" }} />
      <Box sx={{ bg: "white", height: "1px", width: "20px" }} />
    </Flex>
  );
};

export default Index;
