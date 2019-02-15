<!-- show-on-docup
<br />
-->

[![LivepeerJS](https://github.com/livepeer/livepeerjs/raw/master/livepeer_js.png)](https://livepeer.github.io/livepeerjs/)

---

[![Discord](https://img.shields.io/discord/423160867534929930.svg?style=flat-square)](https://discord.gg/7wRSUGX)
[![CircleCI](https://img.shields.io/circleci/project/github/livepeer/livepeerjs.svg?style=flat-square)](https://circleci.com/gh/livepeer/livepeerjs/)
[![Code Climate](https://img.shields.io/codeclimate/coverage/livepeer/livepeerjs.svg?style=flat-square)](https://codeclimate.com/github/livepeer/livepeerjs)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/livepeer/livepeerjs/blob/master/LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=flat-square)](https://lernajs.io/)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg?style=flat-square)](https://github.com/livepeer/livepeerjs/blob/master/CONTRIBUTING.md)

The Livepeer project aims to deliver a live video streaming network protocol that is fully decentralized, highly scalable, crypto token incentivized, and results in a solution which can serve as the live media layer in the decentralized development (web3) stack. You can learn more about the protocol and economic incentives by reading [our whitepaper](https://github.com/livepeer/wiki/blob/master/WHITEPAPER.md).

This monorepo contains JavaScript tools and applications that interact with Livepeer's smart contracts and peer-to-peer network.

<!-- hide-on-docup-start -->

## Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Packages](#packages)
- [Resources](#resources)

<!-- hide-on-docup-stop -->

## Requirements

This project requires `node >=8.0.0` and `yarn >=1.0.0`. A unix shell is also required.

- [Installing Node](https://docs.npmjs.com/getting-started/installing-node)
- [Installing Yarn](https://yarnpkg.com/lang/en/docs/install/)
- [UNIX Shell (Windows users)](https://docs.microsoft.com/en-us/windows/wsl/install-win10)

## Getting Started

To get started, clone the repo and install its dependencies:

```bash
git clone https://github.com/livepeer/livepeerjs.git
cd livepeerjs
yarn
```

For development purposes there's a top-level `start` script that will watch and continiously compile all packages concurrently:

```bash
yarn start
```

For next steps, take a look at documentation for the individual package(s) you want to run and/or develop.

## Contributing

Thanks for your interest in LivepeerJS. There are many ways you can contribute. To start, take a few minutes to look over the official guide:

**[Read the "Contributing to LivepeerJS" Guide &raquo;](https://github.com/livepeer/livepeerjs/blob/master/CONTRIBUTING.md)**

We happily await your pull requests and/or involvement in our [issues page](https://github.com/livepeer/livepeerjs/issues) and hope to see your username on our [list of contributors](https://github.com/livepeer/livepeerjs/graphs/contributors) 🎉🎉🎉

## Packages

### Published

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                                                         | Description                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [`@livepeer/chroma`](https://github.com/livepeer/livepeerjs/tree/master/packages/chroma)                                                                                                                                                             | [![npm](https://img.shields.io/npm/v/@livepeer/chroma.svg?style=flat-square)](https://www.npmjs.com/package/@livepeer/chroma)           | A component library that contains some UI building blocks for livestreaming video applications.                                     |
| [`@livepeer/graphql-sdk`](https://github.com/livepeer/livepeerjs/tree/master/packages/graphql-sdk)                                                                                                                                                   | [![npm](https://img.shields.io/npm/v/@livepeer/graphql-sdk.svg?style=flat-square)](https://www.npmjs.com/package/@livepeer/graphql-sdk) | A GraphQL API that can be used to simplify protocol interaction. It can be used directly in the browser or in node.js applications. |
| [`@livepeer/lpx`](https://github.com/livepeer/livepeerjs/tree/master/packages/lpx)                                                                                                                                                                   | [![npm](https://img.shields.io/npm/v/@livepeer/lpx.svg?style=flat-square)](https://www.npmjs.com/package/@livepeer/lpx)                 | A command line protocol explorer. It has a console mode that allows you to interactively use the sdk.                               |
| [`@livepeer/sdk`](https://github.com/livepeer/livepeerjs/tree/master/packages/sdk)                                                                                                                                                                   | [![npm](https://img.shields.io/npm/v/@livepeer/sdk.svg?style=flat-square)](https://www.npmjs.com/package/@livepeer/sdk)                 | A module for interacting with Livepeer's smart contracts. A core dependency of most LivepeerJS projects.                            |

### Private

| Name                                                                                                 | Description                                                                                                                                                                                                                            |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@livepeer/apollo`](https://github.com/livepeer/livepeerjs/tree/master/packages/apollo)             | Integrates with [@livepeer/graphql-sdk](https://github.com/livepeer/livepeerjs/tree/master/packages/graphql-sdk) with [apollo](https://github.com/apollographql/apollo).                                                               |
| [`@livepeer/explorer`](https://github.com/livepeer/livepeerjs/tree/master/packages/explorer)         | A protocol explorer for the web. It allows users to see general information about the protocol and specific information about Eth addresses within the protocol. See it live at [explorer.livepeer.org](https://explorer.livepeer.org) |
| [`@livepeer/player`](https://github.com/livepeer/livepeerjs/tree/master/packages/player)             | A video player for the web. Lets you see what's live streaming on the network. Our hosted media player runs off of this project. See it live at [media.livepeer.org](https://media.livepeer.org)                                       |
| [`@livepeer/merkle-miner`](https://github.com/livepeer/livepeerjs/tree/master/packages/merkle-miner) | Helpers for mining a merkle proof and generating Livepeer Token                                                                                                                                                                        |
| [`@livepeer/subgraph`](https://github.com/livepeer/livepeerjs/tree/master/packages/subgraph)         | Subgraph manifest for The Graph                                                                                                                                                                                                        |

## Resources

To get a full idea of what Livepeer is about, be sure to take a look at these other resources:

- 🌐 [The Livepeer Website](https://livepeer.org)
- ✍ [The Livepeer Blog](https://medium.com/livepeer-blog)
- 📖 [The Livepeer Docs](https://livepeer.readthedocs.io/)
- 💬 [The Livepeer Chat](https://discord.gg/7wRSUGX)
- ❓ [The Livepeer Forum](https://forum.livepeer.org/)
