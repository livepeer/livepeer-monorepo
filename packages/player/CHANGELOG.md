# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-alpha.7](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2019-11-11)

### Bug Fixes

- **player:** switch accidental 'dev' typo back to 'start'
  ([3dc8a08](https://github.com/livepeer/livepeerjs/commit/3dc8a08))

### Features

- **api-frontend:** introduce api-frontend
  ([#478](https://github.com/livepeer/livepeerjs/issues/478))
  ([47f3621](https://github.com/livepeer/livepeerjs/commit/47f3621))
- **player:** add mux data integration to track video playback analytics
  ([#490](https://github.com/livepeer/livepeerjs/issues/490))
  ([fbc4e5d](https://github.com/livepeer/livepeerjs/commit/fbc4e5d))

# [1.0.0-alpha.6](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2019-05-14)

- MultiMerkleMine Feature (#159)
  ([4d4f6cd](https://github.com/livepeer/livepeerjs/commit/4d4f6cd)), closes
  [#159](https://github.com/livepeer/livepeerjs/issues/159)
  [#149](https://github.com/livepeer/livepeerjs/issues/149)
  [#149](https://github.com/livepeer/livepeerjs/issues/149)
  [#161](https://github.com/livepeer/livepeerjs/issues/161)
  [#167](https://github.com/livepeer/livepeerjs/issues/167)
  [#166](https://github.com/livepeer/livepeerjs/issues/166)
  [#160](https://github.com/livepeer/livepeerjs/issues/160)
  [#159](https://github.com/livepeer/livepeerjs/issues/159)
  [#159](https://github.com/livepeer/livepeerjs/issues/159)

### Features

- 🎸Integrate Livepeer Subgraph
  ([#251](https://github.com/livepeer/livepeerjs/issues/251))
  ([0a159b4](https://github.com/livepeer/livepeerjs/commit/0a159b4)), closes
  [#199](https://github.com/livepeer/livepeerjs/issues/199)
  [#192](https://github.com/livepeer/livepeerjs/issues/192)
- Added button to close the "Join the Alpha" banner in the player's channel
  view. ([#238](https://github.com/livepeer/livepeerjs/issues/238))
  ([4f5098f](https://github.com/livepeer/livepeerjs/commit/4f5098f)), closes
  [#142](https://github.com/livepeer/livepeerjs/issues/142)
- Toggle fullscreen when embedding video
  ([#250](https://github.com/livepeer/livepeerjs/issues/250))
  ([8215a0b](https://github.com/livepeer/livepeerjs/commit/8215a0b))

### Player

- ENS based channel names
  ([#113](https://github.com/livepeer/livepeerjs/issues/113))
  ([0b20dca](https://github.com/livepeer/livepeerjs/commit/0b20dca)), closes
  [#110](https://github.com/livepeer/livepeerjs/issues/110)
  [#110](https://github.com/livepeer/livepeerjs/issues/110)
  [#110](https://github.com/livepeer/livepeerjs/issues/110)
  [#110](https://github.com/livepeer/livepeerjs/issues/110)
  [#110](https://github.com/livepeer/livepeerjs/issues/110)
  [#110](https://github.com/livepeer/livepeerjs/issues/110)

### BREAKING CHANGES

- n
- MurkleMine has been converted from a modal to a webpage

- style(.editorconfig file): Added configuration file for editors

This configuration file will determine the spacing rules for different editors

- Updated transitions

- feat(Added packages/explorer/src/views/Mining/merklemine.json file): Added
  multi-merkle-mine contrac

- Modified view state functions of Mining view form

- feat(packages/explorer/src/views/Mining/index.js): More reactive mining output

- Changed up how I called sendTransaction

- Refactored

- Css file for mine

- feat(Explorer multi merkle mining): Some changes that affect multi merkle
  mining

- feat(packages/explorer/src/views/Mining/index.js): Completed flow of
  merklemine

- feat(packages/explorer/src/views/Mining/style.css): Modified css so that they
  don't affect other vie

- refactor(packages/explorer/.env.development): Added envars for Mining view
- If envars are missing app doesn't work

- fix(Removed previos edit that makes pages depend on localhost blockchain):

Removed previous change which make explorer depend on localhost blockchain

- feat(packages/explorer/src/views/Mining/multi-merklemine.json): Changed file
  name to better describe

- feat(packages/explorer/src/views/Mining/token.json): Added abit file to use in
  a contract

- feat(packages/explorer/src/views/Mining/merklemine.json): Abi file

- feat(packages/explorer/src/views/Mining/index.js): Added feature to make call
  to multigenerate smart

- feat(packages/explorer/src/views/Mining/style.css): Changes to look and feel
  of pages

- fix(packages/merkle-miner/src/index.js): Reverted to a previous change

- feat: Added extension to miner

- fix(packages/explorer/src/views/Mining/index.js): Spelling error

- fix: Fixed styling of link to install Metamask

- fix(style.css): Modified css style for better positioning of paragraph tag on
  Miner page

- fix(packages/explorer/.env.production): Removed web3 http provider envar from
  production build

- feat(packages/explorer/public/static/media/lpt.mp4): Changed the original
  video to this one

- feat(packages/explorer/public/static/media/lpt0.mp4): Moved previous video to
  lpt0.mp4

- feat: Modified dev envars

- fix(packages/explorer/src/views/Mining/index.js): Modified mining page to
  better display ether value

Modified mining page to better display ether values

- feat(packages/explorer/src/views/Token/index.js): Made changes to link on
  token page

- fix(Explorer's mining view index.js and .env files): Added contract addresses
  and fixed ether balanc

- fix(packages/explorer/src/views/Mining/index.js
  packages/explorer/src/views/Token/index.js): Fixed b

- fix(explorer/src/Mining/index.js): Updated gas limit for multimerkle mining

- fix(packages/explorer/src/views/Mining/index.js): Hide edit gas price

- fix(packages/explorer/src/views/Mining/index.js): Fixed spelling on unlciamed
  to unclaimed

- fix: 🐛 Modified compared string to lowercase for compatibility
- n
- MurkleMine has been converted from a modal to a webpage

- style(.editorconfig file): Added configuration file for editors

This configuration file will determine the spacing rules for different editors

- Updated transitions

- feat(Added packages/explorer/src/views/Mining/merklemine.json file): Added
  multi-merkle-mine contrac

- Modified view state functions of Mining view form

- feat(packages/explorer/src/views/Mining/index.js): More reactive mining output

- Changed up how I called sendTransaction

- Refactored

- Css file for mine

- feat(Explorer multi merkle mining): Some changes that affect multi merkle
  mining

- feat(packages/explorer/src/views/Mining/index.js): Completed flow of
  merklemine

- feat(packages/explorer/src/views/Mining/style.css): Modified css so that they
  don't affect other vie

- refactor(packages/explorer/.env.development): Added envars for Mining view
- If envars are missing app doesn't work

- fix(Removed previos edit that makes pages depend on localhost blockchain):

Removed previous change which make explorer depend on localhost blockchain

- feat(packages/explorer/src/views/Mining/multi-merklemine.json): Changed file
  name to better describe

- feat(packages/explorer/src/views/Mining/token.json): Added abit file to use in
  a contract

- feat(packages/explorer/src/views/Mining/merklemine.json): Abi file

- feat(packages/explorer/src/views/Mining/index.js): Added feature to make call
  to multigenerate smart

- feat(packages/explorer/src/views/Mining/style.css): Changes to look and feel
  of pages

- fix(packages/merkle-miner/src/index.js): Reverted to a previous change

- feat: Added extension to miner

- fix(packages/explorer/src/views/Mining/index.js): Spelling error

- fix: Fixed styling of link to install Metamask

- fix(style.css): Modified css style for better positioning of paragraph tag on
  Miner page

- fix(packages/explorer/.env.production): Removed web3 http provider envar from
  production build

- feat(packages/explorer/public/static/media/lpt.mp4): Changed the original
  video to this one

- feat(packages/explorer/public/static/media/lpt0.mp4): Moved previous video to
  lpt0.mp4

- feat: Modified dev envars

- fix(packages/explorer/src/views/Mining/index.js): Modified mining page to
  better display ether value

Modified mining page to better display ether values

- feat(packages/explorer/src/views/Token/index.js): Made changes to link on
  token page

- fix(Explorer's mining view index.js and .env files): Added contract addresses
  and fixed ether balanc

- fix(packages/explorer/src/views/Mining/index.js
  packages/explorer/src/views/Token/index.js): Fixed b

- fix(explorer/src/Mining/index.js): Updated gas limit for multimerkle mining

- fix(packages/explorer/src/views/Mining/index.js): Hide edit gas price

- fix(packages/explorer/src/views/Mining/index.js): Fixed spelling on unlciamed
  to unclaimed

- style(packages/explorer/src/views/Mining/index.js): Modified button to display
  better on small scree
- Updated graphql-sdk module exports; deprecated utils and queries, mocking
  functions are now top-level exports

<a name="1.0.0-alpha.5"></a>

# [1.0.0-alpha.5](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2018-06-28)

### Bug Fixes

- **player:** Fix iframe src url in player embed modal
  ([1d84c5a](https://github.com/livepeer/livepeerjs/commit/1d84c5a))
- **player:** Fix video clipping
  ([42f52bb](https://github.com/livepeer/livepeerjs/commit/42f52bb))

### Features

- Added eth tipping functionality
  ([#73](https://github.com/livepeer/livepeerjs/issues/73))
  ([23e696c](https://github.com/livepeer/livepeerjs/commit/23e696c)), closes
  [#37](https://github.com/livepeer/livepeerjs/issues/37)
- **Channel/index.js:** Added iframe embed button and copy to clipboard to
  Channel/index.js ([#80](https://github.com/livepeer/livepeerjs/issues/80))
  ([04dfbc3](https://github.com/livepeer/livepeerjs/commit/04dfbc3)), closes
  [#40](https://github.com/livepeer/livepeerjs/issues/40)
- **player:** Added Google Analytics for production environment
  ([d5610d6](https://github.com/livepeer/livepeerjs/commit/d5610d6))
- **player:** Major style update
  ([dd84fb3](https://github.com/livepeer/livepeerjs/commit/dd84fb3)), closes
  [#99](https://github.com/livepeer/livepeerjs/issues/99)

<a name="1.0.0-alpha.4"></a>

# [1.0.0-alpha.4](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2018-03-30)

**Note:** Version bump only for package @livepeer/player
