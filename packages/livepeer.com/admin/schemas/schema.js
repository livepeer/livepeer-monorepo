// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

// Document types
import page from "./documents/page";
import route from "./documents/route";
import siteConfig from "./documents/siteConfig";

// Object types
import cta from "./objects/cta";
import embedHTML from "./objects/embedHTML";
import figure from "./objects/figure";
import internalLink from "./objects/internalLink";
import link from "./objects/link";
import portableText from "./objects/portableText";
import simplePortableText from "./objects/simplePortableText";
import logo from "./objects/logo";
import value from "./objects/value";
import imageExtended from "./objects/imageExtended";
import testimonial from "./objects/testimonial";
import markdownSection from "./objects/markdownSection";

// Landing page sections
import hero from "./objects/hero";
import valuesSection from "./objects/valuesSection";
import investorsSection from "./objects/investorsSection";
import testimonialsSection from "./objects/testimonialsSection";
import contactSection from "./objects/contactSection";
import ctaSection from "./objects/ctaSection";
import textSection from "./objects/textSection";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  name: "default",
  // Then proceed to concatenate our our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    cta,
    embedHTML,
    figure,
    imageExtended,
    hero,
    valuesSection,
    investorsSection,
    testimonialsSection,
    contactSection,
    ctaSection,
    textSection,
    internalLink,
    value,
    testimonial,
    link,
    page,
    portableText,
    route,
    simplePortableText,
    siteConfig,
    logo,
    markdownSection
  ])
});
