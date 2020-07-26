const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});
module.exports = withMDX({
  experimental: {
    trailingSlash: false,
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });
    return config;
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx", "svg"],
});
