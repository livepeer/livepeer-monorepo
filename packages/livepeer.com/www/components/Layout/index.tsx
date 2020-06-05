import { DefaultSeo } from "next-seo";
import Navigation from "../Navigation";
import Footer from "../Footer";
import { Flex, Box } from "@theme-ui/components";
import { useEffect } from "react";
import ReactGA from "react-ga";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import Router, { useRouter } from "next/router";
import { Button } from "@theme-ui/components";
import { Link } from "@theme-ui/components";

interface Props {
  title?: string;
  children?: JSX.Element[] | JSX.Element;
  description?: string;
  image?: any;
  url?: string;
  subnav?: boolean;
}

if (process.env.NODE_ENV === "production") {
  ReactGA.initialize(process.env.GA_TRACKING_ID);
} else {
  ReactGA.initialize("test", { testMode: true });
}

// Track client-side page views with Segment & HubSpot
if (process.env.NODE_ENV === "production") {
  Router.events.on("routeChangeComplete", url => {
    window.analytics.page();
    var _hsq = (window["hsq"] = window["hsq"] || []);
    _hsq.push(["setPath", url]);
    _hsq.push(["trackPageView"]);
  });
}

export default ({
  title,
  description,
  children,
  image,
  url,
  subnav = false
}: Props) => {
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

  const router = useRouter();

  const subNavBorder = menuItem => {
    console.log(`pathname: ${router.pathname}`);
    if (router.pathname.includes(menuItem)) {
      return "2px solid black";
    }
    return "0px";
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
        {subnav && (
          <Box
            sx={{
              width: "100%",
              maxWidth: 955,
              mx: "auto",
              paddingBottom: '40px'
            }}
          >
            <Link href="/app/stream" sx={{ paddingRight: "3px" }}>
              <a>
                <Button
                  variant="text"
                  sx={{
                    padding: "0px",
                    borderRadius: "0px",
                    borderBottom: subNavBorder("stream"),
                    lineHeight: "30px"
                  }}
                >
                  Streams
                </Button>
              </a>
            </Link>
            <Link
              href="/app/user"
              sx={{ paddingLeft: "20px", paddingRight: "3px" }}
            >
              <a>
                <Button
                  variant="text"
                  sx={{
                    padding: "0px",
                    borderRadius: "0px",
                    fontWeight: 'bold',
                    borderBottom: subNavBorder("user"),
                    lineHeight: "30px"
                  }}
                >
                  API Tokens
                </Button>
              </a>
            </Link>
            <hr
              sx={{
                borderBottom: '0px solid black',
                margin: "0px",
              }}
            />
          </Box>
        )}
        {children}
      </Flex>
      <Footer />
    </Flex>
  );
};
