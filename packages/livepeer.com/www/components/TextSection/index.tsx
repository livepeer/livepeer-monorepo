import SimpleBlockContent from "../SimpleBlockContent";
import { Container, Box } from "@theme-ui/components";

export default ({ text }) => (
  <Box sx={{ py: 100, bg: "gray" }}>
    <Container>
      <Box sx={{ p: { mb: 4 } }}>
        <SimpleBlockContent blocks={text} />
      </Box>
    </Container>
  </Box>
);
