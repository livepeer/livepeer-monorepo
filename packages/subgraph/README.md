# Livepeer Subgraph
[![Discord](https://img.shields.io/discord/423160867534929930.svg?style=flat-square)](https://discord.gg/7wRSUGX)
[![GitHub issues](https://img.shields.io/github/issues/livepeer/livepeerjs/subgraph.svg?style=flat-square)](https://github.com/livepeer/livepeerjs/labels/subgraph)

This package contains the source code for the Livepeer Subgraph, a project for indexing and querying Livepeer data from the Ethereum blockchain using [The Graph](https://thegraph.com).

## Quick Start

### Prerequisites

To build and run this project you need
to have the following installed on your system:

- Rust (latest stable) - [How to install Rust](https://www.rust-lang.org/en-US/install.html)
- PostgreSQL v9.6 or above – [PostgreSQL Downloads](https://www.postgresql.org/download/)
- IPFS – [Installing IPFS](https://ipfs.io/docs/install/)

For Ethereum network data you can either run a local node or use Infura.io:

- Local node – [Installing and running Ethereum node](https://ethereum.gitbooks.io/frontier-guide/content/getting_a_client.html)
- Infura infra – [Infura.io](https://infura.io/)

Note: We recommend using Infura.io. The Livepeer Subgraph requires access to contract state which means if you'd like to use a local Ethereum node you'd have to run it in archive mode which is not practical unless you have a lot of time to sync or already have one running.

#### Running a local Graph Node

1. Install IPFS and run `ipfs init` followed by `ipfs daemon`
2. Install PostgreSQL and run `initdb -D .postgres` followed by `createdb graph-node`
3. If using Ubuntu, you may need to install additional packages:
   - `sudo apt-get install -y clang libpq-dev libssl-dev pkg-config`
4. Clone https://github.com/graphprotocol/graph-node and run `cargo build`

Once you have all the dependencies set up you can run the following:

```
cargo run -p graph-node --release -- \
  --postgres-url postgresql://USERNAME[:PASSWORD]@localhost:5432/graph-node \
  --ethereum-rpc mainnet:https://mainnet.infura.io/ \
  --ipfs 127.0.0.1:5001 \
```

Try your OS username as `USERNAME` and `PASSWORD`. The password might be optional, it depends on your setup.

This will also spin up a GraphiQL interface at `http://127.0.0.1:8000/`.

### Building & deploying the Subgraph

Back in our subgraph directory, run

```
yarn codegen
yarn deploy --verbosity debug
```

After downloading the latest blocks from Ethereum, you should begin see Livepeer smart contract events flying in. Open a GraphiQL browser at localhost:8000 and begin query the Graph Node to see your data.

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
    lastRewardRound
    active
    status
    rewards {
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
  rounds {
    id
    rewards {
      rewardTokens
      transcoder {
        id
      }
    }
  }
}
```

### Explorer Integration
Once you've got your Graph Node running and successfully deployed the Subgraph, you're ready to
integrate it with the Explorer. Simply set the environment variable `REACT_APP_LIVEPEER_SUBGRAPH` inside `.env.development` to your graphql
endpoint.

For example:
`REACT_APP_LIVEPEER_SUBGRAPH=http://localhost:8000/livepeer/graphql`

The explorer will now query indexed transcoder data from our PostgreSQL database. Note that if you
shutdown the Graph Node, the Explorer will gracefully fallback to
querying the transcoder data from the blockchain directly. 