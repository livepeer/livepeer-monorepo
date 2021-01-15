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
};

module.exports = withTM(withMDX(nextConfig));
