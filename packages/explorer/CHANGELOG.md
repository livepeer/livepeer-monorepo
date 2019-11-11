# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-alpha.7](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2019-11-11)

### Bug Fixes

- **api:** switch back to the hosted subgraph ([e570462](https://github.com/livepeer/livepeerjs/commit/e570462))
- **subgraph:** point at newer hosted subgraph ([7186104](https://github.com/livepeer/livepeerjs/commit/7186104))
- fix issue causing missing transcoders ([#435](https://github.com/livepeer/livepeerjs/issues/435)) ([feb5526](https://github.com/livepeer/livepeerjs/commit/feb5526))

### Features

- **api:** add api node ([#466](https://github.com/livepeer/livepeerjs/issues/466)) ([35bd77e](https://github.com/livepeer/livepeerjs/commit/35bd77e)), closes [#382](https://github.com/livepeer/livepeerjs/issues/382) [#451](https://github.com/livepeer/livepeerjs/issues/451) [#450](https://github.com/livepeer/livepeerjs/issues/450) [#463](https://github.com/livepeer/livepeerjs/issues/463)
- **api-frontend:** introduce api-frontend ([#478](https://github.com/livepeer/livepeerjs/issues/478)) ([47f3621](https://github.com/livepeer/livepeerjs/commit/47f3621))

# [1.0.0-alpha.6](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2019-05-14)

- MultiMerkleMine Feature (#159) ([4d4f6cd](https://github.com/livepeer/livepeerjs/commit/4d4f6cd)), closes [#159](https://github.com/livepeer/livepeerjs/issues/159) [#149](https://github.com/livepeer/livepeerjs/issues/149) [#149](https://github.com/livepeer/livepeerjs/issues/149) [#161](https://github.com/livepeer/livepeerjs/issues/161) [#167](https://github.com/livepeer/livepeerjs/issues/167) [#166](https://github.com/livepeer/livepeerjs/issues/166) [#160](https://github.com/livepeer/livepeerjs/issues/160) [#159](https://github.com/livepeer/livepeerjs/issues/159) [#159](https://github.com/livepeer/livepeerjs/issues/159)

### Bug Fixes

- **explorer:** Fix delegator stake calculations ([bb658e7](https://github.com/livepeer/livepeerjs/commit/bb658e7))
- **explorer:** Fix totalStake math ([3e4c8bd](https://github.com/livepeer/livepeerjs/commit/3e4c8bd))
- rounding error in formatBalance ([#342](https://github.com/livepeer/livepeerjs/issues/342)) ([8fbaeda](https://github.com/livepeer/livepeerjs/commit/8fbaeda)), closes [#338](https://github.com/livepeer/livepeerjs/issues/338) [#336](https://github.com/livepeer/livepeerjs/issues/336) [#334](https://github.com/livepeer/livepeerjs/issues/334)
- **explorer:** use thegraph hosted subgraph ([#365](https://github.com/livepeer/livepeerjs/issues/365)) ([f54ddf6](https://github.com/livepeer/livepeerjs/commit/f54ddf6)), closes [#364](https://github.com/livepeer/livepeerjs/issues/364)
- **explorer:** use UnbondingForm in Account view ([#402](https://github.com/livepeer/livepeerjs/issues/402)) ([909a451](https://github.com/livepeer/livepeerjs/commit/909a451))
- **packages/explorer/graphql-sdk/src/resolvers/Mutations.js:** Fix un… ([#310](https://github.com/livepeer/livepeerjs/issues/310)) ([39e1676](https://github.com/livepeer/livepeerjs/commit/39e1676)), closes [#311](https://github.com/livepeer/livepeerjs/issues/311)
- **packages/explorer/src/utils.js:** Fixed precision in formatting ([#240](https://github.com/livepeer/livepeerjs/issues/240)) ([e19983e](https://github.com/livepeer/livepeerjs/commit/e19983e))

### Features

- 🎸Integrate Livepeer Subgraph ([#251](https://github.com/livepeer/livepeerjs/issues/251)) ([0a159b4](https://github.com/livepeer/livepeerjs/commit/0a159b4)), closes [#199](https://github.com/livepeer/livepeerjs/issues/199) [#192](https://github.com/livepeer/livepeerjs/issues/192)
- Add Block type and currentBlock query to GraphQL schema, connectCurrentBlockQuery enhancer in ([6ade586](https://github.com/livepeer/livepeerjs/commit/6ade586))
- use GraphQL for round initialization and estimate gas ([#343](https://github.com/livepeer/livepeerjs/issues/343)) ([8d66c04](https://github.com/livepeer/livepeerjs/commit/8d66c04))
- **explorer:** Integrate staking alerts ([#370](https://github.com/livepeer/livepeerjs/issues/370)) ([b958afa](https://github.com/livepeer/livepeerjs/commit/b958afa))
- **merkle-miner:** Refactored state, added download progress, and si… ([#130](https://github.com/livepeer/livepeerjs/issues/130)) ([bb0549f](https://github.com/livepeer/livepeerjs/commit/bb0549f)), closes [#33](https://github.com/livepeer/livepeerjs/issues/33) [#121](https://github.com/livepeer/livepeerjs/issues/121) [#131](https://github.com/livepeer/livepeerjs/issues/131)
- **packages/explorer/src/components/UnbondingForm/:** Built unbondin… ([#306](https://github.com/livepeer/livepeerjs/issues/306)) ([9aca92d](https://github.com/livepeer/livepeerjs/commit/9aca92d)), closes [#294](https://github.com/livepeer/livepeerjs/issues/294) [#295](https://github.com/livepeer/livepeerjs/issues/295) [#307](https://github.com/livepeer/livepeerjs/issues/307)
- **subgraph:** switch back to using our subgraph endpoint ([#379](https://github.com/livepeer/livepeerjs/issues/379)) ([d99714b](https://github.com/livepeer/livepeerjs/commit/d99714b))

### Player

- ENS based channel names ([#113](https://github.com/livepeer/livepeerjs/issues/113)) ([0b20dca](https://github.com/livepeer/livepeerjs/commit/0b20dca)), closes [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110) [#110](https://github.com/livepeer/livepeerjs/issues/110)

### BREAKING CHANGES

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

- **Account:** Update account page when the Ethereum address is updated ([#90](https://github.com/livepeer/livepeerjs/issues/90)) ([6700a5c](https://github.com/livepeer/livepeerjs/commit/6700a5c)), closes [#82](https://github.com/livepeer/livepeerjs/issues/82)
- **explorer:** Check don't require round claim prior to bond when when unclaimed rounds < 20 ([ed21d9a](https://github.com/livepeer/livepeerjs/commit/ed21d9a)), closes [#61](https://github.com/livepeer/livepeerjs/issues/61)
- **explorer:** Check for web3 before accessing network version on account page ([b8c4e67](https://github.com/livepeer/livepeerjs/commit/b8c4e67))
- **explorer:** Don't require delegators to claim all rounds before bonding ([69aba5f](https://github.com/livepeer/livepeerjs/commit/69aba5f))
- **explorer:** Fix bond/unbond button on account page ([72ee49b](https://github.com/livepeer/livepeerjs/commit/72ee49b))
- **explorer:** Fix search on landing page ([f4bacbd](https://github.com/livepeer/livepeerjs/commit/f4bacbd)), closes [#93](https://github.com/livepeer/livepeerjs/issues/93)
- **explorer:** Fixed glitchy list rendering caused by overlaying <Drawer>s ([af9e320](https://github.com/livepeer/livepeerjs/commit/af9e320))
- **explorer:** Notifications scroll with the user's viewport ([7de70e9](https://github.com/livepeer/livepeerjs/commit/7de70e9))
- **explorer:** Only show withdraw stake button when delegator is in an unbonded state ([ee135d1](https://github.com/livepeer/livepeerjs/commit/ee135d1))
- **explorer:** Prevent unbond button from appearing when user is unable to bond ([e777536](https://github.com/livepeer/livepeerjs/commit/e777536))
- **explorer:** Skip bond approval when amount is 0, and always show bond button when authenticated ([ecd9805](https://github.com/livepeer/livepeerjs/commit/ecd9805))
- **explorer:** Unclaimed rounds should always be 0 when delegator is unbonded ([cfec64a](https://github.com/livepeer/livepeerjs/commit/cfec64a))
- Allow delegators to bond to another transcoder without going through unbonding waiting period ([#65](https://github.com/livepeer/livepeerjs/issues/65)) ([5ecf8d8](https://github.com/livepeer/livepeerjs/commit/5ecf8d8)), closes [#62](https://github.com/livepeer/livepeerjs/issues/62)
- **explorer:** Use number input for bond amount ([4606693](https://github.com/livepeer/livepeerjs/commit/4606693))
- **TranscoderCard:** New Protocol Restriction: Active Transcoders Can… ([#132](https://github.com/livepeer/livepeerjs/issues/132)) ([f72d618](https://github.com/livepeer/livepeerjs/commit/f72d618)), closes [#94](https://github.com/livepeer/livepeerjs/issues/94)

### Features

- **explorer:** /me path redirects to normal /accounts url ([e0d8a47](https://github.com/livepeer/livepeerjs/commit/e0d8a47)), closes [#67](https://github.com/livepeer/livepeerjs/issues/67)
- **explorer:** Add help messages, update navigation, and add current network indicator ([9404533](https://github.com/livepeer/livepeerjs/commit/9404533))
- **explorer:** Add pending stake and fees, transfer allowance approval form ([7531761](https://github.com/livepeer/livepeerjs/commit/7531761)), closes [#54](https://github.com/livepeer/livepeerjs/issues/54)
- **explorer:** Added CTA banner, tons of tooltips and a tour ui for the transcoders list ([cf855df](https://github.com/livepeer/livepeerjs/commit/cf855df))
- **explorer:** Added Google Analytics ([d79a062](https://github.com/livepeer/livepeerjs/commit/d79a062))
- **explorer:** Added link to report issues and UI for bonding and unbonding on account view ([11e0e22](https://github.com/livepeer/livepeerjs/commit/11e0e22))
- **explorer:** Added link to transcoder social campaigns ([d980cf2](https://github.com/livepeer/livepeerjs/commit/d980cf2))
- **explorer:** Bug fixes, some enhancements, and activity feed ([75416c1](https://github.com/livepeer/livepeerjs/commit/75416c1)), closes [#66](https://github.com/livepeer/livepeerjs/issues/66)
- **explorer:** Inline hint UI and minor style updates ([74c7394](https://github.com/livepeer/livepeerjs/commit/74c7394))
- **explorer:** Moved smart contract addresses into a modal ([c08161f](https://github.com/livepeer/livepeerjs/commit/c08161f))
- **explorer:** Show user stake in transcoder list ([689effa](https://github.com/livepeer/livepeerjs/commit/689effa)), closes [#57](https://github.com/livepeer/livepeerjs/issues/57)
- **explorer:** Update account tabs ([f9b764d](https://github.com/livepeer/livepeerjs/commit/f9b764d))
- **explorer:** Updated landing page ([b309ffc](https://github.com/livepeer/livepeerjs/commit/b309ffc))

### BREAKING CHANGES

- **explorer:** graphql schema and sdk were updated
- **explorer:** Complete refactor or modals and form patterns

<a name="1.0.0-alpha.4"></a>

# [1.0.0-alpha.4](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2018-03-30)

**Note:** Version bump only for package @livepeer/explorer
