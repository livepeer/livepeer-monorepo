const Handlebars = require("handlebars");
const fs = require("fs-extra");
const path = require("path");
const yaml = require("js-yaml");

const { t } = require("typy");

Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

function getNetworkNameForSubgraph() {
  switch (process.env.SUBGRAPH) {
    case undefined:
    case "livepeer/livepeer":
      return "mainnet";
    case "livepeer/livepeer-rinkeby":
      return "rinkeby";
    default:
      return null;
  }
}

(async () => {
  const networksFilePath = path.join(__dirname, "networks.yaml");
  const networks = yaml.load(
    await fs.readFile(networksFilePath, { encoding: "utf-8" })
  );

  const networkName = process.env.NETWORK_NAME || getNetworkNameForSubgraph();
  const network = t(networks, networkName).safeObject;
  if (t(network).isFalsy) {
    throw new Error(
      'Please set either a "NETWORK_NAME" or a "SUBGRAPH" environment variable'
    );
  }

  const subgraphTemplateFilePath = path.join(
    __dirname,
    "subgraph.template.yaml"
  );
  const source = await fs.readFile(subgraphTemplateFilePath, "utf-8");
  const template = Handlebars.compile(source);
  const result = template(network);
  await fs.writeFile(path.join(__dirname, "subgraph.yaml"), result);

  console.log("🎉 subgraph.yaml successfully generated");
})();
