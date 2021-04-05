require("dotenv").config();
const withTM = require("next-transpile-modules")(["@modulz/radix"]);
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

const nextConfig = {
  target: "serverless",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  webpack(config, { webpack }) {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });
    config.plugins.push(new webpack.IgnorePlugin(/^(?:electron)$/));
    return config;
  },
  async redirects() {
    return [
      {
        source: "/accounts/:slug",
        destination: "/accounts/:slug/staking",
        permanent: false,
      },
      {
        source: "/transcoders",
        destination: "/orchestrators",
        permanent: false,
      },
      {
        source: "/accounts/(.*)/transcoding",
        destination: "/accounts/$1/campaign",
        permanent: false,
      },
      {
        source: "/accounts/(.*)/delegating",
        destination: "/accounts/$1/staking",
        permanent: false,
      },
      {
        source: "/accounts/(.*)/overview",
        destination: "/accounts/$1/staking",
        permanent: false,
      },
    ];
  },
};

module.exports = withTM(withMDX(nextConfig));
