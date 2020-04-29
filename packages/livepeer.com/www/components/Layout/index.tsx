import { DefaultSeo } from "next-seo";
import Navigation from "../Navigation";
import Footer from "../Footer";
import { Flex, Box } from "@theme-ui/components";
import { useEffect } from "react";
import ReactGA from "react-ga";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import Router from "next/router";

interface Props {
  title?: string;
  children?: JSX.Element[] | JSX.Element;
  description?: string;
  image?: any;
  url?: string;
}

if (process.env.NODE_ENV === "production") {
  ReactGA.initialize(process.env.GA_TRACKING_ID);
} else {
  ReactGA.initialize("test", { testMode: true });
}

// Track client-side page views with Segment
if (process.env.NODE_ENV === "production") {
  Router.events.on("routeChangeComplete", url => {
    window.analytics.page(url);
  });
}

export default ({ title, description, children, image, url }: Props) => {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const seo = {
    title: title,
    description: description,
    openGraph: {
      title: "Live Video Transcoding - Livepeer",
      description:
        "Scalable, secure live transcoding at a fraction of the cost",
      url: url ? url : "https://livepeer.com",
      images: [
        {
          url: image ? image.url : "https://livepeer.com/img/share-icon.png",
          alt: image ? image.alt : "Live Video Transcoding - Livepeer"
        }
      ]
    }
  };
  return (
    <Flex
      sx={{
        minHeight: "100vh",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <DefaultSeo {...seo} />
      <Flex
        sx={{
          flexGrow: 1,
          flexDirection: "column",
          justifyContent: "flex-start"
        }}
      >
        <Box
          sx={{
            bg: "background",
            zIndex: 2,
            position: "sticky",
            top: 0,
            width: "100%"
          }}
        >
          <Navigation />
        </Box>
        {children}
      </Flex>
      <Footer />
    </Flex>
  );
};
