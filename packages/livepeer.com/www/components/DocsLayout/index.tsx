import Layout from "../Layout";
import Container from "../Container";
import Sidebar from "./sidebar.mdx";
import { Flex, Box } from "@theme-ui/components";

export default ({ children }) => {
  return (
    <Layout>
      <Flex sx={{ justifyContent: "center", flexWrap: "wrap" }}>
        <Box sx={{ padding: 2, maxWidth: "250px" }}>
          <Sidebar />
        </Box>
        <Box sx={{ padding: 3, flexBasis: "958px", flexShrink: 1 }}>
          {children}
        </Box>
      </Flex>
    </Layout>
  );
};
