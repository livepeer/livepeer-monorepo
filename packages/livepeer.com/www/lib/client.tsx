import sanityClient from "@sanity/client";
import sanityImage from "@sanity/image-url";

const options = {
  dataset: "production",
  projectId: "dp4k3mpw",
  useCdn: process.env.NODE_ENV === "production",
};

const client = sanityClient(options);

export const imageBuilder = sanityImage(client);

export default client;
