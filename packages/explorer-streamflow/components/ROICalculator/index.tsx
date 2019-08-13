/** @jsx jsx */
import React from "react";
import { Styled, jsx, Box } from "theme-ui";
import { Card } from "./styles";

export default () => {
  return (
    <Box sx={{ px: 4, width: "100%" }}>
      <Styled.h3 sx={{ mb: 3, textTransform: "uppercase" }}>
        ROI Calculator
      </Styled.h3>
      <Card>
        <Styled.h4>Staken</Styled.h4>
        <Styled.div>hi</Styled.div>
      </Card>
    </Box>
  );
};
