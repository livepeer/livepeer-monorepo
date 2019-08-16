/** @jsx jsx */
import { Styled, jsx, Box, Flex } from "theme-ui";
import Button from "../Button";
import { Row } from "./styles";

export default () => {
  return (
    <Box sx={{ px: 4, width: "100%" }}>
      <Styled.h3
        sx={{ pt: 1, fontWeight: "500", mb: 4, textTransform: "uppercase" }}
      >
        ROI Calculator
      </Styled.h3>
      <Styled.div
        sx={{
          borderRadius: 5,
          width: "100%",
          bg: "background",
          mb: 3
        }}
      >
        <Styled.h4
          sx={{
            p: 3,
            borderBottom: "1px solid",
            borderColor: "border"
          }}
        >
          Staken
        </Styled.h4>
        <Box sx={{ p: 3 }}>
          <Row
            label="Annual"
            earnings="813.12"
            symbol="LPT"
            percentChange="+13.23%"
          />
        </Box>
      </Styled.div>
      <Box sx={{ mb: 5, p: 3 }}>
        <Row
          sx={{ mb: 3 }}
          label="Monthly"
          earnings="813.12"
          symbol="LPT"
          percentChange="+13.23%"
        />
        <Row
          label="Daily"
          earnings="813.12"
          symbol="LPT"
          percentChange="+13.23%"
        />
      </Box>
      <Button sx={{ width: "100%" }}>Bond</Button>
    </Box>
  );
};
