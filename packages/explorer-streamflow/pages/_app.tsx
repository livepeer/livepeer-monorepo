import App, { Container } from "next/app";
import Head from "next/head";
import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { ThemeProvider, ColorMode } from "theme-ui";
import withApolloClient from "../lib/withApollo";
import theme from "../lib/theme";
import MetaMaskContext from "../lib/metamask";

interface IProps {
  apollo: any;
}

class MyApp extends App<IProps> {
  render() {
    const { Component, pageProps, apollo } = this.props;
    return (
      <Container>
        <Head>
          <title>Livepeer Explorer</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
        </Head>
        <MetaMaskContext.Provider immediate={false} value={null}>
          <ApolloProvider client={apollo}>
            <ThemeProvider theme={theme}>
              <ColorMode />
              <Component {...pageProps} />
            </ThemeProvider>
          </ApolloProvider>
        </MetaMaskContext.Provider>
      </Container>
    );
  }
}
export default withApolloClient(MyApp);
