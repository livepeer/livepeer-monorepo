# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-alpha.6](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2019-05-14)

- [READY] Added method to estimate gas in sdk (#239) ([053639d](https://github.com/livepeer/livepeerjs/commit/053639d)), closes [#239](https://github.com/livepeer/livepeerjs/issues/239) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174)
- MultiMerkleMine Feature (#159) ([4d4f6cd](https://github.com/livepeer/livepeerjs/commit/4d4f6cd)), closes [#159](https://github.com/livepeer/livepeerjs/issues/159) [#149](https://github.com/livepeer/livepeerjs/issues/149) [#149](https://github.com/livepeer/livepeerjs/issues/149) [#161](https://github.com/livepeer/livepeerjs/issues/161) [#167](https://github.com/livepeer/livepeerjs/issues/167) [#166](https://github.com/livepeer/livepeerjs/issues/166) [#160](https://github.com/livepeer/livepeerjs/issues/160) [#159](https://github.com/livepeer/livepeerjs/issues/159) [#159](https://github.com/livepeer/livepeerjs/issues/159)

### Bug Fixes

- **explorer:** use UnbondingForm in Account view ([#402](https://github.com/livepeer/livepeerjs/issues/402)) ([909a451](https://github.com/livepeer/livepeerjs/commit/909a451))
- **packages/explorer/graphql-sdk/src/resolvers/Mutations.js:** Fix un… ([#310](https://github.com/livepeer/livepeerjs/issues/310)) ([39e1676](https://github.com/livepeer/livepeerjs/commit/39e1676)), closes [#311](https://github.com/livepeer/livepeerjs/issues/311)

### Features

- Add Block type and currentBlock query to GraphQL schema, connectCurrentBlockQuery enhancer in ([6ade586](https://github.com/livepeer/livepeerjs/commit/6ade586))
- **merkle-miner:** Refactored state, added download progress, and si… ([#130](https://github.com/livepeer/livepeerjs/issues/130)) ([bb0549f](https://github.com/livepeer/livepeerjs/commit/bb0549f)), closes [#33](https://github.com/livepeer/livepeerjs/issues/33) [#121](https://github.com/livepeer/livepeerjs/issues/121) [#131](https://github.com/livepeer/livepeerjs/issues/131)
- **packages/explorer/src/components/UnbondingForm/:** Built unbondin… ([#306](https://github.com/livepeer/livepeerjs/issues/306)) ([9aca92d](https://github.com/livepeer/livepeerjs/commit/9aca92d)), closes [#294](https://github.com/livepeer/livepeerjs/issues/294) [#295](https://github.com/livepeer/livepeerjs/issues/295) [#307](https://github.com/livepeer/livepeerjs/issues/307)
- **sdk:** added getInflation and getInflationChange methods ([#145](https://github.com/livepeer/livepeerjs/issues/145)) ([4183a0b](https://github.com/livepeer/livepeerjs/commit/4183a0b)), closes [#116](https://github.com/livepeer/livepeerjs/issues/116)
- use GraphQL for round initialization and estimate gas ([#343](https://github.com/livepeer/livepeerjs/issues/343)) ([8d66c04](https://github.com/livepeer/livepeerjs/commit/8d66c04))

### Player

- ENS based channel names ([#113](https://github.com/livepeer/livepeerjs/issues/113)) ([0b20dca](https://github.com/livepeer/livepeerjs/commit/0b20dca)), closes [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110)

### BREAKING CHANGES

- Gas limits being estimated are now dynamic and depends of livepeer.rpc.estimateGas
- n
- MurkleMine has been converted from a modal to a webpage

- style(.editorconfig file): Added configuration file for editors

This configuration file will determine the spacing rules for different editors

- Updated transitions

- feat(Added packages/explorer/src/views/Mining/merklemine.json file): Added multi-merkle-mine contrac

- Modified view state functions of Mining view form

- feat(packages/explorer/src/views/Mining/index.js): More reactive mining output

- Changed up how I called sendTransaction

- Refactored

- Css file for mine

- feat(Explorer multi merkle mining): Some changes that affect multi merkle mining

- feat(packages/explorer/src/views/Mining/index.js): Completed flow of merklemine

- feat(packages/explorer/src/views/Mining/style.css): Modified css so that they don't affect other vie

- refactor(packages/explorer/.env.development): Added envars for Mining view
- If envars are missing app doesn't work

- fix(Removed previos edit that makes pages depend on localhost blockchain):

Removed previous change which make explorer depend on localhost blockchain

- feat(packages/explorer/src/views/Mining/multi-merklemine.json): Changed file name to better describe

- feat(packages/explorer/src/views/Mining/token.json): Added abit file to use in a contract

- feat(packages/explorer/src/views/Mining/merklemine.json): Abi file

- feat(packages/explorer/src/views/Mining/index.js): Added feature to make call to multigenerate smart

- feat(packages/explorer/src/views/Mining/style.css): Changes to look and feel of pages

- fix(packages/merkle-miner/src/index.js): Reverted to a previous change

- feat: Added extension to miner

- fix(packages/explorer/src/views/Mining/index.js): Spelling error

- fix: Fixed styling of link to install Metamask

- fix(style.css): Modified css style for better positioning of paragraph tag on Miner page

- fix(packages/explorer/.env.production): Removed web3 http provider envar from production build

- feat(packages/explorer/public/static/media/lpt.mp4): Changed the original video to this one

- feat(packages/explorer/public/static/media/lpt0.mp4): Moved previous video to lpt0.mp4

- feat: Modified dev envars

- fix(packages/explorer/src/views/Mining/index.js): Modified mining page to better display ether value

Modified mining page to better display ether values

- feat(packages/explorer/src/views/Token/index.js): Made changes to link on token page

- fix(Explorer's mining view index.js and .env files): Added contract addresses and fixed ether balanc

- fix(packages/explorer/src/views/Mining/index.js packages/explorer/src/views/Token/index.js): Fixed b

- fix(explorer/src/Mining/index.js): Updated gas limit for multimerkle mining

- fix(packages/explorer/src/views/Mining/index.js): Hide edit gas price

- fix(packages/explorer/src/views/Mining/index.js): Fixed spelling on unlciamed to unclaimed

- fix: 🐛 Modified compared string to lowercase for compatibility
- n
- MurkleMine has been converted from a modal to a webpage

- style(.editorconfig file): Added configuration file for editors

This configuration file will determine the spacing rules for different editors

- Updated transitions

- feat(Added packages/explorer/src/views/Mining/merklemine.json file): Added multi-merkle-mine contrac

- Modified view state functions of Mining view form

- feat(packages/explorer/src/views/Mining/index.js): More reactive mining output

- Changed up how I called sendTransaction

- Refactored

- Css file for mine

- feat(Explorer multi merkle mining): Some changes that affect multi merkle mining

- feat(packages/explorer/src/views/Mining/index.js): Completed flow of merklemine

- feat(packages/explorer/src/views/Mining/style.css): Modified css so that they don't affect other vie

- refactor(packages/explorer/.env.development): Added envars for Mining view
- If envars are missing app doesn't work

- fix(Removed previos edit that makes pages depend on localhost blockchain):

Removed previous change which make explorer depend on localhost blockchain

- feat(packages/explorer/src/views/Mining/multi-merklemine.json): Changed file name to better describe

- feat(packages/explorer/src/views/Mining/token.json): Added abit file to use in a contract

- feat(packages/explorer/src/views/Mining/merklemine.json): Abi file

- feat(packages/explorer/src/views/Mining/index.js): Added feature to make call to multigenerate smart

- feat(packages/explorer/src/views/Mining/style.css): Changes to look and feel of pages

- fix(packages/merkle-miner/src/index.js): Reverted to a previous change

- feat: Added extension to miner

- fix(packages/explorer/src/views/Mining/index.js): Spelling error

- fix: Fixed styling of link to install Metamask

- fix(style.css): Modified css style for better positioning of paragraph tag on Miner page

- fix(packages/explorer/.env.production): Removed web3 http provider envar from production build

- feat(packages/explorer/public/static/media/lpt.mp4): Changed the original video to this one

- feat(packages/explorer/public/static/media/lpt0.mp4): Moved previous video to lpt0.mp4

- feat: Modified dev envars

- fix(packages/explorer/src/views/Mining/index.js): Modified mining page to better display ether value

Modified mining page to better display ether values

- feat(packages/explorer/src/views/Token/index.js): Made changes to link on token page

- fix(Explorer's mining view index.js and .env files): Added contract addresses and fixed ether balanc

- fix(packages/explorer/src/views/Mining/index.js packages/explorer/src/views/Token/index.js): Fixed b

- fix(explorer/src/Mining/index.js): Updated gas limit for multimerkle mining

- fix(packages/explorer/src/views/Mining/index.js): Hide edit gas price

- fix(packages/explorer/src/views/Mining/index.js): Fixed spelling on unlciamed to unclaimed

- style(packages/explorer/src/views/Mining/index.js): Modified button to display better on small scree
- **merkle-miner:** *Success and *Error event handler props are deprecated. Errors are now passed as
  the first param of handlers.

- feat(explorer): Added a merkle mining modal

- feat(explorer): Add token page, tours, and update some metrics in UI
- Updated graphql-sdk module exports; deprecated utils and queries, mocking functions
  are now top-level exports

<a name="1.0.0-alpha.5"></a>

# [1.0.0-alpha.5](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2018-06-28)

### Bug Fixes

- Change signing module to ethereumjs-tx for replay protection ([#53](https://github.com/livepeer/livepeerjs/issues/53)) ([2f4536f](https://github.com/livepeer/livepeerjs/commit/2f4536f))
- **explorer:** Prevent unbond button from appearing when user is unable to bond ([e777536](https://github.com/livepeer/livepeerjs/commit/e777536))

### Code Refactoring

- **sdk:** Updated default address and provider to point towards mainnet ([103d19d](https://github.com/livepeer/livepeerjs/commit/103d19d))

### Features

- **explorer:** Add pending stake and fees, transfer allowance approval form ([7531761](https://github.com/livepeer/livepeerjs/commit/7531761)), closes [#54](https://github.com/livepeer/livepeerjs/issues/54)
- **sdk:** Added utils for parsing tx receipts ([6c63b2a](https://github.com/livepeer/livepeerjs/commit/6c63b2a))

### BREAKING CHANGES

- **explorer:** graphql schema and sdk were updated
- **sdk:** claimEarnings returns tx hash rather than tx receipt
- **sdk:** The SDK will now use mainnet by default for querying data and submitting
  transactions

<a name="1.0.0-alpha.4"></a>

# [1.0.0-alpha.4](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2018-03-30)

**Note:** Version bump only for package @livepeer/sdk
