# Livepeer Subgraph

[![Discord](https://img.shields.io/discord/423160867534929930.svg?style=flat-square)](https://discord.gg/7wRSUGX)
[![GitHub issues](https://img.shields.io/github/issues/livepeer/livepeerjs/subgraph.svg?style=flat-square)](https://github.com/livepeer/livepeerjs/labels/subgraph)

This package contains the source code for the Livepeer Subgraph, a project for
indexing and querying Livepeer data from the Ethereum blockchain using
[The Graph](https://thegraph.com).

## Quickstart

```bash
$ yarn
$ yarn prepare:mainnet
```

The first command installs all external dependencies, while the latter generates
the `subgraph.yaml` file, which is required by The Graph.

We use [Handlebars](https://github.com/wycats/handlebars.js/) to compile a
[template subgraph](./subgraph.template.yaml) and add the parameters specific to
each network (Mainnet and Rinkeby). The network can be changed via the
`NETWORK_NAME` environment variable or directly by choosing a different
"prepare" script. See [package.json](./package.json) for all options.

### Deploy the Livepeer Subgraph to the Graph's hosted service (recommended)

Follow the instructions documented
[here](https://thegraph.com/docs/deploy-a-subgraph).

### Deploy the Livepeer Subgraph locally

1. Install [Docker](https://docs.docker.com) and
   [Docker Compose](https://docs.docker.com/compose/install/)
2. Inside `docker-compose.yml`, set the `ethereum` value under the `environment`
   section to an archive node that has tracing enabled. The reason for requiring
   tracing is because the subgraph relies on call handlers prior to the
   streamflow deployment to index a couple calls and call handlers require
   depend on the Parity tracing API. If you don't have access to an archive node
   with tracing enabled we recommend using [Alchemy](https://alchemyapi.io/).
3. In the root of this project run `docker-compose up`. This command will look
   for the `docker-compose.yml` file and automatically provision a server with
   rust, postgres, and ipfs, and spin up a graph node with a GraphiQL interface
   at `http://127.0.0.1:8000/`.

4. Run `yarn create:local` to create the subgraph
5. Run `yarn deploy:local` to deploy it

After downloading the latest blocks from Ethereum, you should begin to see
Livepeer smart contract events flying in. Open a GraphiQL browser at
localhost:8000 to query the Graph Node.
