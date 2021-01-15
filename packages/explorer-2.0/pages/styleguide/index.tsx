import { Styled, Box } from "theme-ui";
import Typography from "./typography";
import Colors from "./colors";

const Index = () => (
  <Styled.root>
    <Box sx={{ m: 4 }}>
      <Styled.h1 sx={{ mb: 4, color: "primary", fontSize: 8 }}>
        Style Guide
      </Styled.h1>
      <Typography />
      <Colors />
    </Box>
  </Styled.root>
);

export default Index;
