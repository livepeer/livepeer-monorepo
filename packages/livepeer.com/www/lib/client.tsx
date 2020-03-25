import sanityClient from "@sanity/client";

export default sanityClient({
  projectId: "dp4k3mpw",
  dataset: "production",
  token: "", // or leave blank to be anonymous user
  useCdn: false // `false` if you want to ensure fresh data
});
