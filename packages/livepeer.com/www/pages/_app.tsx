import App from "next/app";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";
import { Box } from "@theme-ui/components";
import { Reset, ThemeProvider } from "../lib/theme";

export default class MyApp extends App {
  render() {
    const { Component, pageProps }: any = this.props;

    return (
      <>
        <Head>
          <title>Live Video Transcoding - Livepeer</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <>
          <ThemeProvider>
            <Box sx={{ height: "100%" }}>
              <DefaultSeo {...SEO} />
              <Reset />
              <Component {...pageProps} />
            </Box>
          </ThemeProvider>
        </>
      </>
    );
  }
}
