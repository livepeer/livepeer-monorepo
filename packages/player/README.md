# Livepeer Video Player

[![Discord](https://img.shields.io/discord/423160867534929930.svg?style=flat-square)](https://discord.gg/7wRSUGX)
[![GitHub issues](https://img.shields.io/github/issues/livepeer/livepeerjs/player.svg?style=flat-square)](https://github.com/livepeer/livepeerjs/labels/player)

A video player for the web. Lets you see what's live streaming on the network.
Our hosted media player ([media.livepeer.org](https://media.livepeer.org)) runs
off of this project.

![Screenshot of dapp](./screenshot.png)

<!-- hide-on-docup-start -->

## Table of Contents

- [Installation](#installation)
- [Developing](#developing)
- [Building](#building)

<!-- hide-on-docup-stop -->

## Installation

**Run `yarn` from the root of the monorepo.**

## Developing

```bash
yarn dev
```

> **Note**: The console may output warnings. You can submit a PR to fix them or
> just ignore them since they aren't breaking anything.

## Building

```bash
yarn build
```

Built files will be output to `./dist`

### Customizing Your Build

| Variable                    | Default       | Description                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`                  | `development` | `yarn start` always sets this to `development` and `yarn build` will always set this to `production`. **You should not have to modify this variable**                                                                                                                                                                                                                  |
| `PUBLIC_URL`                | `/`           | The root url of the site (only applies to production builds)                                                                                                                                                                                                                                                                                                           |
| `REACT_APP_HTTP_PROVIDER`   |               | By default, the app will use the Livepeer testnet provider (`https://ethrpc-testnet.livepeer.org`), but this option allows you to specify a custom Ethereum http provider. You may want to use one of the following: <br />**[infura.io](https://infura.io)** - `https://<network>.infura.io/<your-token>`<br />**local geth/testrpc** - `http://localhost:8545`<br /> |
| `REACT_APP_STREAM_ROOT_URL` |               | The root http url from which broadcaster m3u8 files will be served                                                                                                                                                                                                                                                                                                     |

Need a new variable? Create a PR or
[file an issue](https://github.com/livepeer/livepeerjs/issues/new?labels=player)
🍻

### Changing Stream Route on the fly

add `?source=<STREAM_ROOT_URL>/stream` to the player url

**Example**:
`https://media.livepeer.org/embed/0x0ddb225031ccb58ff42866f82d907f7766899014?source=http://localhost:8935/stream`

## Local Mode

pull the local `current` stream. the local livepeer node has to have
`-currentManifest` flag on.

go to `http://localhost:3000/channels/local` . this sets the source to
`http://localhost:8935/stream/current.m3u8`
