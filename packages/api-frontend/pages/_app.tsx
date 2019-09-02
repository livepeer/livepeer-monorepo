import App from "next/app";
import Head from "next/head";
import React from "react";
// import { ApolloProvider } from '@apollo/react-hooks'
import { ThemeProvider, ColorMode } from "theme-ui";
import theme from "@livepeer/explorer-streamflow/dist/lib/theme";
// import withApolloClient from '../lib/withApolloClient'
// import connectors from '../lib/connectors'
// import Web3Provider from 'web3-react'
// import { ethers } from 'ethers'
// import Web3 from 'web3'

interface IProps {
  apolloClient: any;
}

// export default class MyApp extends App<IProps> {
//   render() {
//     const { Component, pageProps, apolloClient } = this.props;
//     return (
//       <div>hi</div>
// <Container>
//   {/* <Head>
//     <title>Livepeer Explorer</title>
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <link
//       rel="stylesheet"
//       href="https://fonts.googleapis.com/icon?family=Material+Icons"
//     />
//   </Head> */}
//   {/* <ApolloProvider client={apolloClient}> */}
//   <ThemeProvider theme={theme}>
//     <ColorMode />
//     {/* <Web3Provider
//       connectors={connectors}
//       libraryName={"web3.js"}
//       web3Api={Web3}
//     > */}
//     <Component {...pageProps} />
//     {/* </Web3Provider> */}
//   </ThemeProvider>
//   {/* </ApolloProvider> */}
// </Container>
//     );
//   }
// }

// export default withApolloClient(MyApp)

export default ({ Component, pageProps }) => {
  return (
    <div>
      <Head>
        <title>Livepeer Explorer</title>
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
    </div>
  );
};
