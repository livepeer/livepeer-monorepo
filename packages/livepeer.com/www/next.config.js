const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/
});
module.exports = withMDX({
  experimental: {
    css: true
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader"
    });
    return config;
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  env: {
    HUBSPOT_PORTAL_ID: process.env.HUBSPOT_PORTAL_ID,
    HUBSPOT_FORM_ID: process.env.HUBSPOT_FORM_ID,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID_DOT_COM
  }
});
