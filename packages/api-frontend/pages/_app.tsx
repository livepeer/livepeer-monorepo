/** @jsx jsx */
import Head from "next/head";
import { ThemeProvider, ColorMode, jsx } from "theme-ui";
import { theme } from "@livepeer/ui";

export default ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Livepeer.live</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>{" "}
      {/* <ApolloProvider client={apolloClient}> */}
      <ThemeProvider theme={theme}>
        <ColorMode />
        {/* <Web3Provider
            connectors={connectors}
            libraryName={"web3.js"}
            web3Api={Web3}
          > */}
        <Component {...pageProps} />
        {/* </Web3Provider> */}
      </ThemeProvider>
      {/* </ApolloProvider> */}
    </>
  );
};
