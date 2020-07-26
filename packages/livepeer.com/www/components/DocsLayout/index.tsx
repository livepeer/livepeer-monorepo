import Layout from "../Layout";
import Sidebar from "./sidebar";
import { Flex, Box, Container } from "@theme-ui/components";

export default ({ children }) => {
  return (
    <Layout>
      <Container sx={{ pb: 4, mt: 40 }}>
        <Flex>
          <Box
            sx={{
              position: "sticky",
              top: 118,
              height: "calc(100vh - 258px)",
              overflow: "scroll",
              minWidth: [350],
              maxWidth: 350
            }}
          >
            <Sidebar />
          </Box>
          <Box
            className="markdown-body"
            sx={{ a: { color: "extremelyBlue" }, pl: 4 }}
          >
            {children}
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};
