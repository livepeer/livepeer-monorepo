import { DefaultSeo } from "next-seo";
import Navigation from "../Navigation";
import Footer from "../Footer";
import { Box } from "@theme-ui/components";
import { useEffect } from "react";
import ReactGA from "react-ga";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";

interface Props {
  title?: string;
  children: JSX.Element[] | JSX.Element;
  description?: string;
  image?: any;
  url?: string;
}

if (process.env.NODE_ENV === "production") {
  ReactGA.initialize(process.env.GA_TRACKING_ID_DOT_COM);
} else {
  ReactGA.initialize("test", { testMode: true });
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
    <Box>
      <DefaultSeo {...seo} />
      <Box>
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
      </Box>
      <Footer />
    </Box>
  );
};
