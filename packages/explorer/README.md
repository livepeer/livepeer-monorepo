# Livepeer Protocol Explorer

[![Discord](https://img.shields.io/discord/423160867534929930.svg?style=flat-square)](https://discord.gg/7wRSUGX)

A protocol explorer for the web. It allows users to see general information about the protocol and specific information about Eth addresses within the protocol. See it live at [explorer.livepeer.org](https://explorer.livepeer.org)

<!-- hide-on-docup-start -->

## Table of Contents

* [Installation](#installation)
* [Developing](#developing)
* [Building](#building)

<!-- hide-on-docup-stop -->

## Installation

**Run `yarn` from the root of the monorepo.**

Once you've done that, you're all set! ✨

> **Warning**: If you modify any dependencies of this project (`@livepeer/apollo`, `@livepeer/graphql-sdk`, etc), you will need to rebuild those projects for those updates propagate to this one.

## Developing

If you want to hack on this app, just run:

```bash
yarn start
```

Be sure to watch the output and follow the instructions on the command line.

Once the app is available (most likely at `http://localhost:3000`), you are free to edit files in the [`src`](https://github.com/livepeer/livepeerjs/tree/master/packages/explorer/src) directory. The app will rebuild and update as you make changes.

This project is bootstrapped with [create-react-app](https://github.com/facebook/create-react-app), so all of their documentation applies here as well.

> **Info**: This app was originally created with both `redux` and `apollo`. As development has progressed, `redux` has served very little purpose, and is in the process of being phased out of this app.

### Project Structure

```
.
├── public/
|   ├── .
|   └── index.html
└── src
    ├── index.js
    ├── registerServiceWorker.js
    ├── store.js
    ├── utils.js
    ├── components/
    ├── containers/
    ├── electron/
    ├── enhancers/
    ├── services/
    └── views/
```

| Directory                      | Description                                                                                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.`                            | config files: .prettierrc, .gitignore, webpack.config.prod.js, package.json, README.md, etc                                                           |
| `public/.`                     | assets (images, fonts, etc) go here                                                                                                                   |
| `public/index.html`            | the app's html entrypoint                                                                                                                             |
| `src/index.js`                 | the app's js entrypoint                                                                                                                               |
| `src/registerServiceWorker.js` | default CRA service worker registration script                                                                                                        |
| `src/store.js`                 | [DEPRECATED] creates browser or memory history, imports `redux` services, registers the devtools extension, applies middleware, and creates the store |
| `src/utils.js`                 | helper functions that get used across the app                                                                                                         |
| `src/components/`              | contains `react` components that are used in multiple views and/or containers                                                                         |
| `src/containers/`              | home of the `Root` component (wraps the app in any required providers) and the `App` component (hooks up views to routes via `react-router`)          |
| `src/electron/`                | this is where the `electron` app's main process file abides.                                                                                          |
| `src/enhancers/`               | HOCs that wrap multiple components and/or views                                                                                                       |
| `src/services/`                | [DEPRECATED] `redux` services live here                                                                                                               |
| `src/views/`                   | the app's views go here                                                                                                                               |

## Building

You can build this app as a website or as a desktop app (via `electron`).

* **Website:** `yarn build:web` (outputs to `./build`)
* **Desktop:** `yarn build:desktop` (outputs to `./dist`)

**Note:** Only the OSX desktop build has been configured. If you would like to add a configuration for linux or windows, please modify the config accordingly in [package.json](https://github.com/livepeer/livepeerjs/blob/master/packages/explorer/package.json#L45), and [file a PR](https://github.com/livepeer/livepeerjs/pulls) 🍻

### Customizing A Build

In either case, here are some environment variables you can use to customize the build:

| Variable                   | Default       | Description                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`                 | `development` | `yarn start` always sets this to `development` and `yarn build` will always set this to `production`. **You should not have to modify this variable**                                                                                                                                                                                                                  |
| `PUBLIC_URL`               | `/`           | The root url of the site (only applies to production builds)                                                                                                                                                                                                                                                                                                           |
| `REACT_APP_HTTP_PROVIDER`  |               | By default, the app will use the Livepeer testnet provider (`https://ethrpc-testnet.livepeer.org`), but this option allows you to specify a custom Ethereum http provider. You may want to use one of the following: <br />**[infura.io](https://infura.io)** - `https://<network>.infura.io/<your-token>`<br />**local geth/testrpc** - `http://localhost:8545`<br /> |
| `REACT_APP_GA_TRACKING_ID` |               | The Google Analytics tracking id to use (production environment only)                                                                                                                                                                                                                                                                                                  |

Need a new variable? Create a PR or [file an issue](https://github.com/livepeer/livepeerjs/issues) 🍻
