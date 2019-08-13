const withTM = require("next-transpile-modules");

module.exports = withTM({
  transpileModules: ["next-mui-helper"],
  distDir: "../.next",
  webpack: (config, {}) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader"
    });
    return config;
  }
});
