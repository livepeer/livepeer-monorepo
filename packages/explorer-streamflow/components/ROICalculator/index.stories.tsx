import * as React from "react";
import { storiesOf } from "@storybook/react";
import { ApolloProvider } from "@apollo/react-hooks";
import { ThemeProvider, ColorMode } from "theme-ui";
import initApollo from "../../lib/initApollo";
import theme from "../../lib/theme";
import ROICalculator from "./index";
import Reset from "../../lib/reset";

const apolloClient = initApollo();

storiesOf("ROICalculator", module).add("with text", () => (
  <ApolloProvider client={apolloClient}>
    <ThemeProvider theme={theme}>
      <Reset />
      <ColorMode />
      <ROICalculator
        protocol={{ totalTokenSupply: "100", totalBondedToken: "100" }}
      />
    </ThemeProvider>
  </ApolloProvider>
));
