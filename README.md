![LivepeerJS](./logo.svg) JS

---

[![Discord](https://img.shields.io/discord/423160867534929930.svg)](https://discord.gg/7wRSUGX) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/livepeer/livepeerjs/blob/master/LICENSE)


The Livepeer project aims to deliver a live video streaming network protocol that is fully decentralized, highly scalable, crypto token incentivized, and results in a solution which can serve as the live media layer in the decentralized development (web3) stack. You can learn more abobut the protocol and economic incentives by reading [our whitepaper](https://github.com/livepeer/wiki/blob/master/WHITEPAPER.md).

<!-- hide-on-docup-start -->

## Table of Contents

* [Requirements](#requirements)
* [Getting Started](#getting-started)
* [Packages](#packages)
* [Resources](#resources)

<!-- hide-on-docup-stop -->

## Requirements

This project requires `node >=8.0.0` and `yarn >=1.0.0`.

* [Installing Node](https://docs.npmjs.com/getting-started/installing-node)
* [Installing Yarn](https://yarnpkg.com/lang/en/docs/install/)

## Getting Started

To get started, clone the repo and install its dependencies

```bash
git clone https://github.com/livepeer/livepeerjs.git
cd livepeerjs
yarn
```

For next steps, take a look at documentation for the individual package(s) you want to run and/or develop. Just follow the links in the next section.

## Packages

### Published

| Name                                                                                              | Version                                                                                                               | Description                                                                                                                         |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [`@livepeer/chroma`](https://github.com/livepeer/livepeerjs/tree/master/@livepeer/chroma)           | [![npm](https://img.shields.io/npm/v/@livepeer/chroma.svg)](https://www.npmjs.com/package/@livepeer/chroma)           | A component library that contains some UI building blocks for livestreaming video applications.                                     |
| [`@livepeer/graphql-sdk`](https://github.com/livepeer/livepeerjs/tree/master/@livepeer/graphql-sdk) | [![npm](https://img.shields.io/npm/v/@livepeer/graphql-sdk.svg)](https://www.npmjs.com/package/@livepeer/graphql-sdk) | A GraphQL API that can be used to simplify protocol interaction. It can be used directly in the browser or in node.js applications. |
| [`@livepeer/lpx`](https://github.com/livepeer/livepeerjs/tree/master/@livepeer/lpx)                 | [![npm](https://img.shields.io/npm/v/@livepeer/lpx.svg)](https://www.npmjs.com/package/@livepeer/lpx)                 | A command line protocol explorer. It has a console mode that allows you to interactively use the sdk.                               |
| [`@livepeer/sdk`](https://github.com/livepeer/livepeerjs/tree/master/@livepeer/sdk)                 | [![npm](https://img.shields.io/npm/v/@livepeer/sdk.svg)](https://www.npmjs.com/package/@livepeer/sdk)                 | A module for interacting with Livepeer's smart contracts. A core dependency of most LivepeerJS projects.                            |

### Private

| Name                                                                                        | Description                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@livepeer/apollo`](https://github.com/livepeer/livepeerjs/tree/master/@livepeer/apollo)     | Integrates with [@livepeer/graphql-sdk](https://github.com/livepeer/livepeerjs/tree/master/@livepeer/graphql-sdk) with [apollo](https://github.com/apollographql/apollo).                                                              |
| [`@livepeer/explorer`](https://github.com/livepeer/livepeerjs/tree/master/@livepeer/explorer) | A protocol explorer for the web. It allows users to see general information about the protocol and specific information about Eth addresses within the protocol. See it live at [explorer.livepeer.org](https://explorer.livepeer.org) |
| [`@livepeer/player`](https://github.com/livepeer/livepeerjs/tree/master/@livepeer/player)     | A video player for the web. Lets you see what's live streaming on the network. Our hosted media player runs off of this project. See it live at [media.livepeer.org](https://media.livepeer.org)                                       |

## Resources

To get a full idea of what Livepeer is about, be sure to take a look at these other resources:

* 🌐 [The Livepeer Website](https://livepeer.org)
* ✍ [The Livepeer Blog](https://medium.com/livepeer-blog)
* 📖 [The Livepeer Docs](https://livepeer.readthedocs.io/)
* 💬 [The Livepeer Chat](https://discord.gg/7wRSUGX)
* ❓ [The Livepeer Forum](https://forum.livepeer.org/)
