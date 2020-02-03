# Livepeer Subgraph

[![Discord](https://img.shields.io/discord/423160867534929930.svg?style=flat-square)](https://discord.gg/7wRSUGX)
[![GitHub issues](https://img.shields.io/github/issues/livepeer/livepeerjs/subgraph.svg?style=flat-square)](https://github.com/livepeer/livepeerjs/labels/subgraph)

This package contains the source code for the Livepeer Subgraph, a project for
indexing and querying Livepeer data from the Ethereum blockchain using [The Graph](https://thegraph.com).

## Contributing

Before you can build, create and deploy this subgraph, you have to execute the following commands in the terminal:

```bash
$ yarn
$ yarn prepare:mainnet
```

The first command installs all external dependencies, while the latter generates the `subgraph.yaml` file, which is
required by The Graph.

We use [Handlebars](https://github.com/wycats/handlebars.js/) to compile a [template subgraph](./subgraph.template.yaml) and add the parameters specific to each
network (Mainnet, Goerli, Kovan, Rinkeby, Ropsten). The network can be changed via the `NETWORK_NAME` environment
variable or directly by choosing a different "prepare" script. See [package.json](./package.json) for all options.
