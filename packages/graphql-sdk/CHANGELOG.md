# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-alpha.7](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2019-11-11)

**Note:** Version bump only for package @livepeer/graphql-sdk

# [1.0.0-alpha.6](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2019-05-14)

- [READY] Added method to estimate gas in sdk (#239) ([053639d](https://github.com/livepeer/livepeerjs/commit/053639d)), closes [#239](https://github.com/livepeer/livepeerjs/issues/239) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174)

### Bug Fixes

- **explorer:** use UnbondingForm in Account view ([#402](https://github.com/livepeer/livepeerjs/issues/402)) ([909a451](https://github.com/livepeer/livepeerjs/commit/909a451))
- **graphql-sdk:** fix graphiql server ([7016897](https://github.com/livepeer/livepeerjs/commit/7016897))
- **packages/explorer/graphql-sdk/src/resolvers/Mutations.js:** Fix un… ([#310](https://github.com/livepeer/livepeerjs/issues/310)) ([39e1676](https://github.com/livepeer/livepeerjs/commit/39e1676)), closes [#311](https://github.com/livepeer/livepeerjs/issues/311)

### Features

- **merkle-miner:** Refactored state, added download progress, and si… ([#130](https://github.com/livepeer/livepeerjs/issues/130)) ([bb0549f](https://github.com/livepeer/livepeerjs/commit/bb0549f)), closes [#33](https://github.com/livepeer/livepeerjs/issues/33) [#121](https://github.com/livepeer/livepeerjs/issues/121) [#131](https://github.com/livepeer/livepeerjs/issues/131)
- 🎸Integrate Livepeer Subgraph ([#251](https://github.com/livepeer/livepeerjs/issues/251)) ([0a159b4](https://github.com/livepeer/livepeerjs/commit/0a159b4)), closes [#199](https://github.com/livepeer/livepeerjs/issues/199) [#192](https://github.com/livepeer/livepeerjs/issues/192)
- Add Block type and currentBlock query to GraphQL schema, connectCurrentBlockQuery enhancer in ([6ade586](https://github.com/livepeer/livepeerjs/commit/6ade586))
- **packages/explorer/src/components/UnbondingForm/:** Built unbondin… ([#306](https://github.com/livepeer/livepeerjs/issues/306)) ([9aca92d](https://github.com/livepeer/livepeerjs/commit/9aca92d)), closes [#294](https://github.com/livepeer/livepeerjs/issues/294) [#295](https://github.com/livepeer/livepeerjs/issues/295) [#307](https://github.com/livepeer/livepeerjs/issues/307)
- use GraphQL for round initialization and estimate gas ([#343](https://github.com/livepeer/livepeerjs/issues/343)) ([8d66c04](https://github.com/livepeer/livepeerjs/commit/8d66c04))

### Player

- ENS based channel names ([#113](https://github.com/livepeer/livepeerjs/issues/113)) ([0b20dca](https://github.com/livepeer/livepeerjs/commit/0b20dca)), closes [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110)

### BREAKING CHANGES

- Gas limits being estimated are now dynamic and depends of livepeer.rpc.estimateGas
- **merkle-miner:** *Success and *Error event handler props are deprecated. Errors are now passed as
  the first param of handlers.

- feat(explorer): Added a merkle mining modal

- feat(explorer): Add token page, tours, and update some metrics in UI
- Updated graphql-sdk module exports; deprecated utils and queries, mocking functions
  are now top-level exports

<a name="1.0.0-alpha.5"></a>

# [1.0.0-alpha.5](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2018-06-28)

### Features

- **explorer:** Add pending stake and fees, transfer allowance approval form ([7531761](https://github.com/livepeer/livepeerjs/commit/7531761)), closes [#54](https://github.com/livepeer/livepeerjs/issues/54)
- **graphql-sdk:** Added coinbase query ([4d37864](https://github.com/livepeer/livepeerjs/commit/4d37864))
- **graphql-sdk:** Added Transactions schema, queries, and subscriptions. Also updated some mutation ([6df4e2a](https://github.com/livepeer/livepeerjs/commit/6df4e2a))

### BREAKING CHANGES

- **explorer:** graphql schema and sdk were updated
- **graphql-sdk:** Updated schema

<a name="1.0.0-alpha.4"></a>

# [1.0.0-alpha.4](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2018-03-30)

**Note:** Version bump only for package @livepeer/graphql-sdk
