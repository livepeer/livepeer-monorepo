# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-alpha.7](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2019-11-11)

### Bug Fixes

- **api:** add @livepeer/sdk dependency ([#468](https://github.com/livepeer/livepeerjs/issues/468)) ([6002235](https://github.com/livepeer/livepeerjs/commit/6002235))
- **api:** disable 30fps, round TARGETDURATION header ([#495](https://github.com/livepeer/livepeerjs/issues/495)) ([8d2ba1f](https://github.com/livepeer/livepeerjs/commit/8d2ba1f))
- **api:** don't double up on full URLs ([b5ca440](https://github.com/livepeer/livepeerjs/commit/b5ca440))
- **api:** fix failing test ([30d299d](https://github.com/livepeer/livepeerjs/commit/30d299d))
- **api:** misc fixes for new amalgamated api endpoint ([#492](https://github.com/livepeer/livepeerjs/issues/492)) ([214e007](https://github.com/livepeer/livepeerjs/commit/214e007))
- **api:** properly serve /login from worker ([a54d6b0](https://github.com/livepeer/livepeerjs/commit/a54d6b0))
- **api:** properly stringify errors ([f4a298f](https://github.com/livepeer/livepeerjs/commit/f4a298f))
- **api:** remove duplicate presets ([#501](https://github.com/livepeer/livepeerjs/issues/501)) ([6189b59](https://github.com/livepeer/livepeerjs/commit/6189b59))
- **api:** remove duplicate sourceInfo ([921d0b7](https://github.com/livepeer/livepeerjs/commit/921d0b7))
- **api:** sanitize incoming urls ([4b26981](https://github.com/livepeer/livepeerjs/commit/4b26981))
- **api:** switch back to the hosted subgraph ([e570462](https://github.com/livepeer/livepeerjs/commit/e570462))
- **api-frontend:** get rid of sidebar errors ([a9eb393](https://github.com/livepeer/livepeerjs/commit/a9eb393))
- **player:** switch accidental 'dev' typo back to 'start' ([3dc8a08](https://github.com/livepeer/livepeerjs/commit/3dc8a08))
- **subgraph:** point at newer hosted subgraph ([7186104](https://github.com/livepeer/livepeerjs/commit/7186104))
- fix issue causing missing transcoders ([#435](https://github.com/livepeer/livepeerjs/issues/435)) ([feb5526](https://github.com/livepeer/livepeerjs/commit/feb5526))

### Features

- **api:** add /api/orchestrator/ext/:token ([#482](https://github.com/livepeer/livepeerjs/issues/482)) ([ca89895](https://github.com/livepeer/livepeerjs/commit/ca89895))
- **api:** add api node ([#466](https://github.com/livepeer/livepeerjs/issues/466)) ([35bd77e](https://github.com/livepeer/livepeerjs/commit/35bd77e)), closes [#382](https://github.com/livepeer/livepeerjs/issues/382) [#451](https://github.com/livepeer/livepeerjs/issues/451) [#450](https://github.com/livepeer/livepeerjs/issues/450) [#463](https://github.com/livepeer/livepeerjs/issues/463)
- **api:** add broadcaster m3u8 amalgamation ([#491](https://github.com/livepeer/livepeerjs/issues/491)) ([0ee0ea8](https://github.com/livepeer/livepeerjs/commit/0ee0ea8))
- **api:** bump jest ([#474](https://github.com/livepeer/livepeerjs/issues/474)) ([6684f56](https://github.com/livepeer/livepeerjs/commit/6684f56))
- **api:** implement auto-deploying cloudflare worker ([#485](https://github.com/livepeer/livepeerjs/issues/485)) ([1e513a1](https://github.com/livepeer/livepeerjs/commit/1e513a1))
- **api:** switch to azure regions ([9aed4ce](https://github.com/livepeer/livepeerjs/commit/9aed4ce))
- **api-frontend:** introduce api-frontend ([#478](https://github.com/livepeer/livepeerjs/issues/478)) ([47f3621](https://github.com/livepeer/livepeerjs/commit/47f3621))
- **player:** add mux data integration to track video playback analytics ([#490](https://github.com/livepeer/livepeerjs/issues/490)) ([fbc4e5d](https://github.com/livepeer/livepeerjs/commit/fbc4e5d))
- **wowza:** add ignored sourceInfo field to Wowza schema ([dee9a37](https://github.com/livepeer/livepeerjs/commit/dee9a37))

# [1.0.0-alpha.6](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2019-05-14)

- [READY] Added method to estimate gas in sdk (#239) ([053639d](https://github.com/livepeer/livepeerjs/commit/053639d)), closes [#239](https://github.com/livepeer/livepeerjs/issues/239) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174) [#174](https://github.com/livepeer/livepeerjs/issues/174)
- MultiMerkleMine Feature (#159) ([4d4f6cd](https://github.com/livepeer/livepeerjs/commit/4d4f6cd)), closes [#159](https://github.com/livepeer/livepeerjs/issues/159) [#149](https://github.com/livepeer/livepeerjs/issues/149) [#149](https://github.com/livepeer/livepeerjs/issues/149) [#161](https://github.com/livepeer/livepeerjs/issues/161) [#167](https://github.com/livepeer/livepeerjs/issues/167) [#166](https://github.com/livepeer/livepeerjs/issues/166) [#160](https://github.com/livepeer/livepeerjs/issues/160) [#159](https://github.com/livepeer/livepeerjs/issues/159) [#159](https://github.com/livepeer/livepeerjs/issues/159)

### Bug Fixes

- **.circleci/config.yml:** Make tests to master be tested. ([#304](https://github.com/livepeer/livepeerjs/issues/304)) ([1591af5](https://github.com/livepeer/livepeerjs/commit/1591af5))
- rounding error in formatBalance ([#342](https://github.com/livepeer/livepeerjs/issues/342)) ([8fbaeda](https://github.com/livepeer/livepeerjs/commit/8fbaeda)), closes [#338](https://github.com/livepeer/livepeerjs/issues/338) [#336](https://github.com/livepeer/livepeerjs/issues/336) [#334](https://github.com/livepeer/livepeerjs/issues/334)
- **apollo:** fix transcoders view when on rinkeby ([#398](https://github.com/livepeer/livepeerjs/issues/398)) ([593060f](https://github.com/livepeer/livepeerjs/commit/593060f))
- **explorer:** Fix delegator stake calculations ([bb658e7](https://github.com/livepeer/livepeerjs/commit/bb658e7))
- **explorer:** Fix totalStake math ([3e4c8bd](https://github.com/livepeer/livepeerjs/commit/3e4c8bd))
- **explorer:** use thegraph hosted subgraph ([#365](https://github.com/livepeer/livepeerjs/issues/365)) ([f54ddf6](https://github.com/livepeer/livepeerjs/commit/f54ddf6)), closes [#364](https://github.com/livepeer/livepeerjs/issues/364)
- **explorer:** use UnbondingForm in Account view ([#402](https://github.com/livepeer/livepeerjs/issues/402)) ([909a451](https://github.com/livepeer/livepeerjs/commit/909a451))
- **graphql-sdk:** fix graphiql server ([7016897](https://github.com/livepeer/livepeerjs/commit/7016897))
- **packages/explorer/graphql-sdk/src/resolvers/Mutations.js:** Fix un… ([#310](https://github.com/livepeer/livepeerjs/issues/310)) ([39e1676](https://github.com/livepeer/livepeerjs/commit/39e1676)), closes [#311](https://github.com/livepeer/livepeerjs/issues/311)
- **packages/explorer/src/utils.js:** Fixed precision in formatting ([#240](https://github.com/livepeer/livepeerjs/issues/240)) ([e19983e](https://github.com/livepeer/livepeerjs/commit/e19983e))

### Features

- 🎸Integrate Livepeer Subgraph ([#251](https://github.com/livepeer/livepeerjs/issues/251)) ([0a159b4](https://github.com/livepeer/livepeerjs/commit/0a159b4)), closes [#199](https://github.com/livepeer/livepeerjs/issues/199) [#192](https://github.com/livepeer/livepeerjs/issues/192)
- Add Block type and currentBlock query to GraphQL schema, connectCurrentBlockQuery enhancer in ([6ade586](https://github.com/livepeer/livepeerjs/commit/6ade586))
- **.circleci/config.yml:** Changing the deployment workflow ([#258](https://github.com/livepeer/livepeerjs/issues/258)) ([9cdbfdb](https://github.com/livepeer/livepeerjs/commit/9cdbfdb)), closes [#235](https://github.com/livepeer/livepeerjs/issues/235)
- **explorer:** Integrate staking alerts ([#370](https://github.com/livepeer/livepeerjs/issues/370)) ([b958afa](https://github.com/livepeer/livepeerjs/commit/b958afa))
- **merkle-miner:** Refactored state, added download progress, and si… ([#130](https://github.com/livepeer/livepeerjs/issues/130)) ([bb0549f](https://github.com/livepeer/livepeerjs/commit/bb0549f)), closes [#33](https://github.com/livepeer/livepeerjs/issues/33) [#121](https://github.com/livepeer/livepeerjs/issues/121) [#131](https://github.com/livepeer/livepeerjs/issues/131)
- **monitor:** add @livepeer/monitor ([#392](https://github.com/livepeer/livepeerjs/issues/392)) ([8933af7](https://github.com/livepeer/livepeerjs/commit/8933af7))
- **monitor:** add timeouts, HTTP error reporting ([a4b852e](https://github.com/livepeer/livepeerjs/commit/a4b852e))
- Added button to close the "Join the Alpha" banner in the player's channel view. ([#238](https://github.com/livepeer/livepeerjs/issues/238)) ([4f5098f](https://github.com/livepeer/livepeerjs/commit/4f5098f)), closes [#142](https://github.com/livepeer/livepeerjs/issues/142)
- Toggle fullscreen when embedding video ([#250](https://github.com/livepeer/livepeerjs/issues/250)) ([8215a0b](https://github.com/livepeer/livepeerjs/commit/8215a0b))
- use GraphQL for round initialization and estimate gas ([#343](https://github.com/livepeer/livepeerjs/issues/343)) ([8d66c04](https://github.com/livepeer/livepeerjs/commit/8d66c04))
- **packages/explorer/src/components/UnbondingForm/:** Built unbondin… ([#306](https://github.com/livepeer/livepeerjs/issues/306)) ([9aca92d](https://github.com/livepeer/livepeerjs/commit/9aca92d)), closes [#294](https://github.com/livepeer/livepeerjs/issues/294) [#295](https://github.com/livepeer/livepeerjs/issues/295) [#307](https://github.com/livepeer/livepeerjs/issues/307)
- **sdk:** added getInflation and getInflationChange methods ([#145](https://github.com/livepeer/livepeerjs/issues/145)) ([4183a0b](https://github.com/livepeer/livepeerjs/commit/4183a0b)), closes [#116](https://github.com/livepeer/livepeerjs/issues/116)
- **subgraph:** switch back to using our subgraph endpoint ([#379](https://github.com/livepeer/livepeerjs/issues/379)) ([d99714b](https://github.com/livepeer/livepeerjs/commit/d99714b))

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

- Allow delegators to bond to another transcoder without going through unbonding waiting period ([#65](https://github.com/livepeer/livepeerjs/issues/65)) ([5ecf8d8](https://github.com/livepeer/livepeerjs/commit/5ecf8d8)), closes [#62](https://github.com/livepeer/livepeerjs/issues/62)
- **explorer:** Only show withdraw stake button when delegator is in an unbonded state ([ee135d1](https://github.com/livepeer/livepeerjs/commit/ee135d1))
- Change signing module to ethereumjs-tx for replay protection ([#53](https://github.com/livepeer/livepeerjs/issues/53)) ([2f4536f](https://github.com/livepeer/livepeerjs/commit/2f4536f))
- **Account:** Update account page when the Ethereum address is updated ([#90](https://github.com/livepeer/livepeerjs/issues/90)) ([6700a5c](https://github.com/livepeer/livepeerjs/commit/6700a5c)), closes [#82](https://github.com/livepeer/livepeerjs/issues/82)
- **chroma:** Mute player by default ([c4fe82c](https://github.com/livepeer/livepeerjs/commit/c4fe82c))
- **explorer:** Check don't require round claim prior to bond when when unclaimed rounds < 20 ([ed21d9a](https://github.com/livepeer/livepeerjs/commit/ed21d9a)), closes [#61](https://github.com/livepeer/livepeerjs/issues/61)
- **explorer:** Check for web3 before accessing network version on account page ([b8c4e67](https://github.com/livepeer/livepeerjs/commit/b8c4e67))
- **explorer:** Don't require delegators to claim all rounds before bonding ([69aba5f](https://github.com/livepeer/livepeerjs/commit/69aba5f))
- **explorer:** Fix bond/unbond button on account page ([72ee49b](https://github.com/livepeer/livepeerjs/commit/72ee49b))
- **explorer:** Fix search on landing page ([f4bacbd](https://github.com/livepeer/livepeerjs/commit/f4bacbd)), closes [#93](https://github.com/livepeer/livepeerjs/issues/93)
- **explorer:** Fixed glitchy list rendering caused by overlaying <Drawer>s ([af9e320](https://github.com/livepeer/livepeerjs/commit/af9e320))
- **explorer:** Notifications scroll with the user's viewport ([7de70e9](https://github.com/livepeer/livepeerjs/commit/7de70e9))
- **explorer:** Prevent unbond button from appearing when user is unable to bond ([e777536](https://github.com/livepeer/livepeerjs/commit/e777536))
- **explorer:** Skip bond approval when amount is 0, and always show bond button when authenticated ([ecd9805](https://github.com/livepeer/livepeerjs/commit/ecd9805))
- **explorer:** Unclaimed rounds should always be 0 when delegator is unbonded ([cfec64a](https://github.com/livepeer/livepeerjs/commit/cfec64a))
- **explorer:** Use number input for bond amount ([4606693](https://github.com/livepeer/livepeerjs/commit/4606693))
- **player:** Fix iframe src url in player embed modal ([1d84c5a](https://github.com/livepeer/livepeerjs/commit/1d84c5a))
- **player:** Fix video clipping ([42f52bb](https://github.com/livepeer/livepeerjs/commit/42f52bb))
- **TranscoderCard:** New Protocol Restriction: Active Transcoders Can… ([#132](https://github.com/livepeer/livepeerjs/issues/132)) ([f72d618](https://github.com/livepeer/livepeerjs/commit/f72d618)), closes [#94](https://github.com/livepeer/livepeerjs/issues/94)

### Code Refactoring

- **sdk:** Updated default address and provider to point towards mainnet ([103d19d](https://github.com/livepeer/livepeerjs/commit/103d19d))

### Features

- **apollo:** Added persistent cache and gql subscription support ([067382e](https://github.com/livepeer/livepeerjs/commit/067382e))
- **apollo:** Allow options argument to be a callback that resolves an options object ([e9086c4](https://github.com/livepeer/livepeerjs/commit/e9086c4))
- **Channel/index.js:** Added iframe embed button and copy to clipboard to Channel/index.js ([#80](https://github.com/livepeer/livepeerjs/issues/80)) ([04dfbc3](https://github.com/livepeer/livepeerjs/commit/04dfbc3)), closes [#40](https://github.com/livepeer/livepeerjs/issues/40)
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
- **graphql-sdk:** Added coinbase query ([4d37864](https://github.com/livepeer/livepeerjs/commit/4d37864))
- **graphql-sdk:** Added Transactions schema, queries, and subscriptions. Also updated some mutation ([6df4e2a](https://github.com/livepeer/livepeerjs/commit/6df4e2a))
- **merkle-miner:** Added a merkle miner module ([#120](https://github.com/livepeer/livepeerjs/issues/120)) ([13f58cc](https://github.com/livepeer/livepeerjs/commit/13f58cc))
- **player:** Added Google Analytics for production environment ([d5610d6](https://github.com/livepeer/livepeerjs/commit/d5610d6))
- **player:** Major style update ([dd84fb3](https://github.com/livepeer/livepeerjs/commit/dd84fb3)), closes [#99](https://github.com/livepeer/livepeerjs/issues/99)
- **sdk:** Added utils for parsing tx receipts ([6c63b2a](https://github.com/livepeer/livepeerjs/commit/6c63b2a))
- Added eth tipping functionality ([#73](https://github.com/livepeer/livepeerjs/issues/73)) ([23e696c](https://github.com/livepeer/livepeerjs/commit/23e696c)), closes [#37](https://github.com/livepeer/livepeerjs/issues/37)

### BREAKING CHANGES

- **explorer:** graphql schema and sdk were updated
- **explorer:** Complete refactor or modals and form patterns
- **graphql-sdk:** Updated schema
- **sdk:** claimEarnings returns tx hash rather than tx receipt
- **sdk:** The SDK will now use mainnet by default for querying data and submitting
  transactions

<a name="1.0.0-alpha.4"></a>

# [1.0.0-alpha.4](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2018-03-30)

### Code Refactoring

- **graphql-sdk:** Updated typedefs and resolvers to work with latest sdk updates ([930145c](https://github.com/livepeer/livepeerjs/commit/930145c))

### Features

- **apollo:** Added option for controllerAddress ([c5729ed](https://github.com/livepeer/livepeerjs/commit/c5729ed))
- **player:** Embed route ([8f35f61](https://github.com/livepeer/livepeerjs/commit/8f35f61))
- **sdk:** Add controllerAddress option and update rpc methods to reflect ABI updates ([1c3a6e3](https://github.com/livepeer/livepeerjs/commit/1c3a6e3)), closes [#36](https://github.com/livepeer/livepeerjs/issues/36)

### BREAKING CHANGES

- **graphql-sdk:** Somee type definitions have changed
- **sdk:** Some method signatures have changed

<a name="1.0.0-alpha.3"></a>

# [1.0.0-alpha.3](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2018-02-14)

<a name="1.0.0-alpha.2"></a>

# [1.0.0-alpha.2](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2018-02-14)

<a name="1.0.0-alpha.1"></a>

# [1.0.0-alpha.1](https://github.com/livepeer/livepeerjs/compare/65e46ad...v1.0.0-alpha.1) (2018-02-14)

### Bug Fixes

- **apollo:** Gracefully handle getting account from web3 when provider is not testnet ([1e96022](https://github.com/livepeer/livepeerjs/commit/1e96022))
- **chroma:** Basically rewrote most of the logic for live stream handling in the video player ([a1cd9c2](https://github.com/livepeer/livepeerjs/commit/a1cd9c2))
- **chroma:** Improved handling of new src prop in lifecycle methods ([4120f90](https://github.com/livepeer/livepeerjs/commit/4120f90))
- **chroma:** iOS playback and thumbnail rendering fixed ([a0d39de](https://github.com/livepeer/livepeerjs/commit/a0d39de))
- **explorer:** Account view no longer shows selected MetaMask account ([cae0cf3](https://github.com/livepeer/livepeerjs/commit/cae0cf3))
- **explorer:** Fixed delegator round / delegate formatting issues and added network indicator on lan ([e7146a7](https://github.com/livepeer/livepeerjs/commit/e7146a7)), closes [#31](https://github.com/livepeer/livepeerjs/issues/31) [#30](https://github.com/livepeer/livepeerjs/issues/30)
- **explorer:** Fixed percentage formatting ([9e14e69](https://github.com/livepeer/livepeerjs/commit/9e14e69))
- **explorer:** Redirect from /me to landing page when no eth.accounts are available ([27ffb89](https://github.com/livepeer/livepeerjs/commit/27ffb89))
- **explorer:** Show bonded amount if it's greater than 0 ([896da9a](https://github.com/livepeer/livepeerjs/commit/896da9a))
- **graphql-sdk:** Add browser targets to babelrc ([e68b76c](https://github.com/livepeer/livepeerjs/commit/e68b76c))
- **graphql-sdk:** Force failure for CDN requests that take >= 3s ([7b28d99](https://github.com/livepeer/livepeerjs/commit/7b28d99))
- **graphql-sdk:** Omit transcoding profiles from m3u8 stream url ([05d528f](https://github.com/livepeer/livepeerjs/commit/05d528f))
- **graphql-sdk:** Update introspectionTypes ([71600b1](https://github.com/livepeer/livepeerjs/commit/71600b1))
- **lpx:** Updated video profile printing command to work with latest sdk constant values ([68a64b2](https://github.com/livepeer/livepeerjs/commit/68a64b2))
- **player:** Don't reload page when account switches ([055f30a](https://github.com/livepeer/livepeerjs/commit/055f30a))
- **player:** Fixed issue where the player to becomes unresponsive when navigating between channels ([be47155](https://github.com/livepeer/livepeerjs/commit/be47155))
- **player:** Streams play immediately without first using the old player ([0f6ebbd](https://github.com/livepeer/livepeerjs/commit/0f6ebbd))
- **player:** Use secure streamRootUrl and import babel-polyfill ([e0f5713](https://github.com/livepeer/livepeerjs/commit/e0f5713))
- **player:** Video player is now visible in Firefox ([cc23309](https://github.com/livepeer/livepeerjs/commit/cc23309))
- **sdk:** fixed claimTokenPoolsShares() and added transferToken() method ([22b647f](https://github.com/livepeer/livepeerjs/commit/22b647f))
- **sdk:** Fixed log filtering for job events ([3ab2146](https://github.com/livepeer/livepeerjs/commit/3ab2146))
- **sdk:** Fixed video profile serialization and added test case ([4db25f2](https://github.com/livepeer/livepeerjs/commit/4db25f2))
- **sdk:** Removed accidental trailing comma in claimTokenPoolsShares method ([e93b379](https://github.com/livepeer/livepeerjs/commit/e93b379))
- **sdk:** Update default HttpProvider to secure url and target browsers in babelrc ([fec4150](https://github.com/livepeer/livepeerjs/commit/fec4150))
- **sdk:** Use BN to calculate endRound when claiming token pools shares ([f094362](https://github.com/livepeer/livepeerjs/commit/f094362))
- **sdk:** Use default provider if config specifies a provider that is undefined ([7e09c5e](https://github.com/livepeer/livepeerjs/commit/7e09c5e))

### Features

- **apollo:** Added a defaultGas option ([41f8c44](https://github.com/livepeer/livepeerjs/commit/41f8c44))
- **apollo:** Added a new project for graphql-sdk integration into apollo-client ([050f2c6](https://github.com/livepeer/livepeerjs/commit/050f2c6))
- **apollo:** Option to pass provider via options ([3bff872](https://github.com/livepeer/livepeerjs/commit/3bff872))
- **chroma:** Added caching for Snapshot and better default styles for VideoPlayer ([187233f](https://github.com/livepeer/livepeerjs/commit/187233f))
- **chroma:** Added cropping and scaling to Snapshot component ([65e46ad](https://github.com/livepeer/livepeerjs/commit/65e46ad))
- **chroma:** Improved Snapshot updated logic ([8037d55](https://github.com/livepeer/livepeerjs/commit/8037d55))
- **chroma:** onLive and onDead callbacks ([f955277](https://github.com/livepeer/livepeerjs/commit/f955277))
- **explorer:** Add account broadcasting view ([1d8b554](https://github.com/livepeer/livepeerjs/commit/1d8b554))
- **explorer:** Added a deposit button ([17f70ab](https://github.com/livepeer/livepeerjs/commit/17f70ab))
- **explorer:** Added bonding modal that handles error/success states and unbond button ([1a932ff](https://github.com/livepeer/livepeerjs/commit/1a932ff))
- **explorer:** Added Navbar ([761ade9](https://github.com/livepeer/livepeerjs/commit/761ade9))
- **explorer:** Added tabs on profile page and began converting view into subview modules ([7b36e43](https://github.com/livepeer/livepeerjs/commit/7b36e43))
- **explorer:** Bonding modal ([23f0a1b](https://github.com/livepeer/livepeerjs/commit/23f0a1b))
- **explorer:** Electron build script ([8678197](https://github.com/livepeer/livepeerjs/commit/8678197))
- **explorer:** Fixed and updated transactions ([42f3587](https://github.com/livepeer/livepeerjs/commit/42f3587))
- **explorer:** Hook up transcoders view to graphQL ([1b6aad2](https://github.com/livepeer/livepeerjs/commit/1b6aad2))
- **explorer:** Humble beginnings of our browser-based protocol explorer ([31be3d6](https://github.com/livepeer/livepeerjs/commit/31be3d6))
- **explorer:** Integrate with MetaMask and add faucet actions for ETH and LPT ([2d6b186](https://github.com/livepeer/livepeerjs/commit/2d6b186))
- **explorer:** Polling account info ([5b77878](https://github.com/livepeer/livepeerjs/commit/5b77878))
- **explorer:** Pretty transcoder card, scroll position restoration when navigating, improved avatar ([2f93eee](https://github.com/livepeer/livepeerjs/commit/2f93eee))
- **explorer:** Super basic functioning Bonding button ([6a48e92](https://github.com/livepeer/livepeerjs/commit/6a48e92))
- **explorer:** Transcoder election view, and general UI update ([47bff97](https://github.com/livepeer/livepeerjs/commit/47bff97))
- **explorer:** Updated all Account subviews (overview, broadcasting, delegating, transcoding) ([1df196f](https://github.com/livepeer/livepeerjs/commit/1df196f))
- **graphql-sdk:** Added a me query ([a3349a7](https://github.com/livepeer/livepeerjs/commit/a3349a7))
- **graphql-sdk:** Added introspectionQueryResultData export ([66153c1](https://github.com/livepeer/livepeerjs/commit/66153c1))
- **graphql-sdk:** Added jobs() query parameter -- broadcasterWhereJobId ([97c631f](https://github.com/livepeer/livepeerjs/commit/97c631f))
- **graphql-sdk:** Added schemas for User, Broadcaster, Delegator, Transcoder, etc ([7b10ed8](https://github.com/livepeer/livepeerjs/commit/7b10ed8))
- **graphql-sdk:** Added token approve and bond mutations ([c0ff59f](https://github.com/livepeer/livepeerjs/commit/c0ff59f))
- **graphql-sdk:** Added transcoders() query and simplified project by removing interface types ([31f54d5](https://github.com/livepeer/livepeerjs/commit/31f54d5))
- **graphql-sdk:** Added unbond mutation ([1d34699](https://github.com/livepeer/livepeerjs/commit/1d34699))
- **graphql-sdk:** New project -- an isomorphic GraphQL API that can be used to simplify protocol ex ([2727eff](https://github.com/livepeer/livepeerjs/commit/2727eff))
- **graphql-sdk:** Support totalStake field in Transcoder type ([d6cc53a](https://github.com/livepeer/livepeerjs/commit/d6cc53a))
- **lpx:** Add -c, --config flag to console command ([c0b18bc](https://github.com/livepeer/livepeerjs/commit/c0b18bc))
- **lpx:** Integrated latest sdk and added support for config (.lpxrc) ([9dd7da1](https://github.com/livepeer/livepeerjs/commit/9dd7da1))
- **player:** Added favicons ([a2310bc](https://github.com/livepeer/livepeerjs/commit/a2310bc))
- **player:** Added polling and updated GraphQL query ([08d27a8](https://github.com/livepeer/livepeerjs/commit/08d27a8))
- **player:** Added support for services that export a saga ([9bfbf41](https://github.com/livepeer/livepeerjs/commit/9bfbf41))
- **player:** Integrated with graphql-sdk to create an ApolloClient instance, which greatly eases th ([e2d37c7](https://github.com/livepeer/livepeerjs/commit/e2d37c7))
- **player:** Updated UI to include social links and a simple landing page ([d5aa7e4](https://github.com/livepeer/livepeerjs/commit/d5aa7e4))
- **sdk:** Added new getBroadcaster method ([4a9c36e](https://github.com/livepeer/livepeerjs/commit/4a9c36e))
- **sdk:** getTranscoderTotalStake method ([23d7e51](https://github.com/livepeer/livepeerjs/commit/23d7e51))
- **sdk:** Wait for transaction receipts ([0262ff7](https://github.com/livepeer/livepeerjs/commit/0262ff7))
