# Livepeer Subgraph

[![Discord](https://img.shields.io/discord/423160867534929930.svg?style=flat-square)](https://discord.gg/7wRSUGX)
[![GitHub issues](https://img.shields.io/github/issues/livepeer/livepeerjs/subgraph.svg?style=flat-square)](https://github.com/livepeer/livepeerjs/labels/subgraph)

This package contains the source code for the Livepeer Subgraph, a project for
indexing and querying Livepeer data from the Ethereum blockchain using [The Graph](https://thegraph.com).

## Quick Start

### Running a local Graph Node with Docker Compose

The quickest way to run a Graph Node locally is to use the
[graph-node docker image](https://hub.docker.com/r/graphprotocol/graph-node/).

1. Install [Docker](https://docs.docker.com) and [Docker Compose](https://docs.docker.com/compose/install/)
2. In the root of this project run `docker-compose up`

This command will look for the `docker-compose.yml` file and automatically provision a server with rust, postgres, and ipfs, and
spin up a graph node with a GraphiQL interface at `http://127.0.0.1:8000/`.
Congrats, you're now ready to build and deploy the Livepeer subgraph.

If you'd like to view the logs inside docker run `docker attach --sig-proxy=false graph-node`

### Building and Deploying the Livepeer Subgraph

Build types
`yarn codegen`

Compile subgraph
`yarn build`

Create subgraph
`yarn create-local`

Deploy subgraph
`yarn deploy-local`

After downloading the latest blocks from Ethereum, you should begin to see
Livepeer smart contract events flying in. Open a GraphiQL browser at
localhost:8000 to query the Graph Node.

Here's an example query for fetching Livepeer transcoders:

```
query {
  transcoders {
    id
    rewardCut
    feeShare
    pricePerSegment
    pendingRewardCut
    pendingFeeShare
    pendingPricePerSegment
    totalStake
    lastRewardRound {
      id
    }
    active
    status
    pools (orderBy: id, orderDirection: desc) {
      rewardTokens
      round {
        id
      }
    }
  }
}
```

Here's another example query for fetching rounds:

```
query {
  rounds(orderBy: timestamp, orderDirection: desc, first: 5) {
    id
    pools {
      rewardTokens
      transcoder {
        id
      }
    }
  }
}
```