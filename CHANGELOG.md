# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.0-alpha.5"></a>
# [1.0.0-alpha.5](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2018-06-28)


### Bug Fixes

* Allow delegators to bond to another transcoder without going through unbonding waiting period ([#65](https://github.com/livepeer/livepeerjs/issues/65)) ([5ecf8d8](https://github.com/livepeer/livepeerjs/commit/5ecf8d8)), closes [#62](https://github.com/livepeer/livepeerjs/issues/62)
* **explorer:** Only show withdraw stake button when delegator is in an unbonded state ([ee135d1](https://github.com/livepeer/livepeerjs/commit/ee135d1))
* Change signing module to ethereumjs-tx for replay protection ([#53](https://github.com/livepeer/livepeerjs/issues/53)) ([2f4536f](https://github.com/livepeer/livepeerjs/commit/2f4536f))
* **Account:** Update account page when the Ethereum address is updated ([#90](https://github.com/livepeer/livepeerjs/issues/90)) ([6700a5c](https://github.com/livepeer/livepeerjs/commit/6700a5c)), closes [#82](https://github.com/livepeer/livepeerjs/issues/82)
* **chroma:** Mute player by default ([c4fe82c](https://github.com/livepeer/livepeerjs/commit/c4fe82c))
* **explorer:** Check don't require round claim prior to bond when when unclaimed rounds < 20 ([ed21d9a](https://github.com/livepeer/livepeerjs/commit/ed21d9a)), closes [#61](https://github.com/livepeer/livepeerjs/issues/61)
* **explorer:** Check for web3 before accessing network version on account page ([b8c4e67](https://github.com/livepeer/livepeerjs/commit/b8c4e67))
* **explorer:** Don't require delegators to claim all rounds before bonding ([69aba5f](https://github.com/livepeer/livepeerjs/commit/69aba5f))
* **explorer:** Fix bond/unbond button on account page ([72ee49b](https://github.com/livepeer/livepeerjs/commit/72ee49b))
* **explorer:** Fix search on landing page ([f4bacbd](https://github.com/livepeer/livepeerjs/commit/f4bacbd)), closes [#93](https://github.com/livepeer/livepeerjs/issues/93)
* **explorer:** Fixed glitchy list rendering caused by overlaying <Drawer>s ([af9e320](https://github.com/livepeer/livepeerjs/commit/af9e320))
* **explorer:** Notifications scroll with the user's viewport ([7de70e9](https://github.com/livepeer/livepeerjs/commit/7de70e9))
* **explorer:** Prevent unbond button from appearing when user is unable to bond ([e777536](https://github.com/livepeer/livepeerjs/commit/e777536))
* **explorer:** Skip bond approval when amount is 0, and always show bond button when authenticated ([ecd9805](https://github.com/livepeer/livepeerjs/commit/ecd9805))
* **explorer:** Unclaimed rounds should always be 0 when delegator is unbonded ([cfec64a](https://github.com/livepeer/livepeerjs/commit/cfec64a))
* **explorer:** Use number input for bond amount ([4606693](https://github.com/livepeer/livepeerjs/commit/4606693))
* **player:** Fix iframe src  url in player embed modal ([1d84c5a](https://github.com/livepeer/livepeerjs/commit/1d84c5a))
* **player:** Fix video clipping ([42f52bb](https://github.com/livepeer/livepeerjs/commit/42f52bb))
* **TranscoderCard:** New Protocol Restriction: Active Transcoders Can… ([#132](https://github.com/livepeer/livepeerjs/issues/132)) ([f72d618](https://github.com/livepeer/livepeerjs/commit/f72d618)), closes [#94](https://github.com/livepeer/livepeerjs/issues/94)


### Code Refactoring

* **sdk:** Updated default address and provider to point towards mainnet ([103d19d](https://github.com/livepeer/livepeerjs/commit/103d19d))


### Features

* **apollo:** Added persistent cache and gql subscription support ([067382e](https://github.com/livepeer/livepeerjs/commit/067382e))
* **apollo:** Allow options argument to be a callback that resolves an options object ([e9086c4](https://github.com/livepeer/livepeerjs/commit/e9086c4))
* **Channel/index.js:** Added iframe embed button and copy to clipboard to Channel/index.js ([#80](https://github.com/livepeer/livepeerjs/issues/80)) ([04dfbc3](https://github.com/livepeer/livepeerjs/commit/04dfbc3)), closes [#40](https://github.com/livepeer/livepeerjs/issues/40)
* **explorer:** /me path redirects to normal /accounts url ([e0d8a47](https://github.com/livepeer/livepeerjs/commit/e0d8a47)), closes [#67](https://github.com/livepeer/livepeerjs/issues/67)
* **explorer:** Add help messages, update navigation, and add current network indicator ([9404533](https://github.com/livepeer/livepeerjs/commit/9404533))
* **explorer:** Add pending stake and fees, transfer allowance approval form ([7531761](https://github.com/livepeer/livepeerjs/commit/7531761)), closes [#54](https://github.com/livepeer/livepeerjs/issues/54)
* **explorer:** Added CTA banner, tons of tooltips and a tour ui for the transcoders list ([cf855df](https://github.com/livepeer/livepeerjs/commit/cf855df))
* **explorer:** Added Google Analytics ([d79a062](https://github.com/livepeer/livepeerjs/commit/d79a062))
* **explorer:** Added link to report issues and UI for bonding and unbonding on account view ([11e0e22](https://github.com/livepeer/livepeerjs/commit/11e0e22))
* **explorer:** Added link to transcoder social campaigns ([d980cf2](https://github.com/livepeer/livepeerjs/commit/d980cf2))
* **explorer:** Bug fixes, some enhancements, and activity feed ([75416c1](https://github.com/livepeer/livepeerjs/commit/75416c1)), closes [#66](https://github.com/livepeer/livepeerjs/issues/66)
* **explorer:** Inline hint UI and minor style updates ([74c7394](https://github.com/livepeer/livepeerjs/commit/74c7394))
* **explorer:** Moved smart contract addresses into a modal ([c08161f](https://github.com/livepeer/livepeerjs/commit/c08161f))
* **explorer:** Show user stake in transcoder list ([689effa](https://github.com/livepeer/livepeerjs/commit/689effa)), closes [#57](https://github.com/livepeer/livepeerjs/issues/57)
* **explorer:** Update account tabs ([f9b764d](https://github.com/livepeer/livepeerjs/commit/f9b764d))
* **explorer:** Updated landing page ([b309ffc](https://github.com/livepeer/livepeerjs/commit/b309ffc))
* **graphql-sdk:** Added coinbase query ([4d37864](https://github.com/livepeer/livepeerjs/commit/4d37864))
* **graphql-sdk:** Added Transactions schema, queries, and subscriptions. Also updated some mutation ([6df4e2a](https://github.com/livepeer/livepeerjs/commit/6df4e2a))
* **merkle-miner:** Added a merkle miner module ([#120](https://github.com/livepeer/livepeerjs/issues/120)) ([13f58cc](https://github.com/livepeer/livepeerjs/commit/13f58cc))
* **player:** Added Google Analytics for production environment ([d5610d6](https://github.com/livepeer/livepeerjs/commit/d5610d6))
* **player:** Major style update ([dd84fb3](https://github.com/livepeer/livepeerjs/commit/dd84fb3)), closes [#99](https://github.com/livepeer/livepeerjs/issues/99)
* **sdk:** Added utils for parsing tx receipts ([6c63b2a](https://github.com/livepeer/livepeerjs/commit/6c63b2a))
* Added eth tipping functionality ([#73](https://github.com/livepeer/livepeerjs/issues/73)) ([23e696c](https://github.com/livepeer/livepeerjs/commit/23e696c)), closes [#37](https://github.com/livepeer/livepeerjs/issues/37)


### BREAKING CHANGES

* **explorer:** graphql schema and sdk were updated
* **explorer:** Complete refactor or modals and form patterns
* **graphql-sdk:** Updated schema
* **sdk:** claimEarnings returns tx hash rather than tx receipt
* **sdk:** The SDK will now use mainnet by default for querying data and submitting
transactions




<a name="1.0.0-alpha.4"></a>
# [1.0.0-alpha.4](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2018-03-30)


### Code Refactoring

* **graphql-sdk:** Updated typedefs and resolvers to work with latest sdk updates ([930145c](https://github.com/livepeer/livepeerjs/commit/930145c))


### Features

* **apollo:** Added option for controllerAddress ([c5729ed](https://github.com/livepeer/livepeerjs/commit/c5729ed))
* **player:** Embed route ([8f35f61](https://github.com/livepeer/livepeerjs/commit/8f35f61))
* **sdk:** Add controllerAddress option and update rpc methods to reflect ABI updates ([1c3a6e3](https://github.com/livepeer/livepeerjs/commit/1c3a6e3)), closes [#36](https://github.com/livepeer/livepeerjs/issues/36)


### BREAKING CHANGES

* **graphql-sdk:** Somee type definitions have changed
* **sdk:** Some method signatures have changed




<a name="1.0.0-alpha.3"></a>
# [1.0.0-alpha.3](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2018-02-14)



<a name="1.0.0-alpha.2"></a>
# [1.0.0-alpha.2](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2018-02-14)



<a name="1.0.0-alpha.1"></a>
# [1.0.0-alpha.1](https://github.com/livepeer/livepeerjs/compare/65e46ad...v1.0.0-alpha.1) (2018-02-14)


### Bug Fixes

* **apollo:** Gracefully handle getting account from web3 when provider is not testnet ([1e96022](https://github.com/livepeer/livepeerjs/commit/1e96022))
* **chroma:** Basically rewrote most of the logic for live stream handling in the video player ([a1cd9c2](https://github.com/livepeer/livepeerjs/commit/a1cd9c2))
* **chroma:** Improved handling of new src prop in lifecycle methods ([4120f90](https://github.com/livepeer/livepeerjs/commit/4120f90))
* **chroma:** iOS playback and thumbnail rendering fixed ([a0d39de](https://github.com/livepeer/livepeerjs/commit/a0d39de))
* **explorer:** Account view no longer shows selected MetaMask account ([cae0cf3](https://github.com/livepeer/livepeerjs/commit/cae0cf3))
* **explorer:** Fixed delegator round / delegate formatting issues and added network indicator on lan ([e7146a7](https://github.com/livepeer/livepeerjs/commit/e7146a7)), closes [#31](https://github.com/livepeer/livepeerjs/issues/31) [#30](https://github.com/livepeer/livepeerjs/issues/30)
* **explorer:** Fixed percentage formatting ([9e14e69](https://github.com/livepeer/livepeerjs/commit/9e14e69))
* **explorer:** Redirect from /me to landing page when no eth.accounts are available ([27ffb89](https://github.com/livepeer/livepeerjs/commit/27ffb89))
* **explorer:** Show bonded amount if it's greater than 0 ([896da9a](https://github.com/livepeer/livepeerjs/commit/896da9a))
* **graphql-sdk:** Add browser targets to babelrc ([e68b76c](https://github.com/livepeer/livepeerjs/commit/e68b76c))
* **graphql-sdk:** Force failure for CDN requests that take >= 3s ([7b28d99](https://github.com/livepeer/livepeerjs/commit/7b28d99))
* **graphql-sdk:** Omit transcoding profiles from  m3u8 stream url ([05d528f](https://github.com/livepeer/livepeerjs/commit/05d528f))
* **graphql-sdk:** Update introspectionTypes ([71600b1](https://github.com/livepeer/livepeerjs/commit/71600b1))
* **lpx:** Updated video profile printing command to work with latest sdk constant values ([68a64b2](https://github.com/livepeer/livepeerjs/commit/68a64b2))
* **player:** Don't reload page when account switches ([055f30a](https://github.com/livepeer/livepeerjs/commit/055f30a))
* **player:** Fixed issue where the player to becomes unresponsive when navigating between channels ([be47155](https://github.com/livepeer/livepeerjs/commit/be47155))
* **player:** Streams play immediately without first using the old player ([0f6ebbd](https://github.com/livepeer/livepeerjs/commit/0f6ebbd))
* **player:** Use secure streamRootUrl and import babel-polyfill ([e0f5713](https://github.com/livepeer/livepeerjs/commit/e0f5713))
* **player:** Video player is now visible in Firefox ([cc23309](https://github.com/livepeer/livepeerjs/commit/cc23309))
* **sdk:** fixed claimTokenPoolsShares() and added transferToken() method ([22b647f](https://github.com/livepeer/livepeerjs/commit/22b647f))
* **sdk:** Fixed log filtering for job events ([3ab2146](https://github.com/livepeer/livepeerjs/commit/3ab2146))
* **sdk:** Fixed video profile serialization and added test case ([4db25f2](https://github.com/livepeer/livepeerjs/commit/4db25f2))
* **sdk:** Removed accidental trailing comma in claimTokenPoolsShares method ([e93b379](https://github.com/livepeer/livepeerjs/commit/e93b379))
* **sdk:** Update default HttpProvider to secure url and target browsers in babelrc ([fec4150](https://github.com/livepeer/livepeerjs/commit/fec4150))
* **sdk:** Use BN to calculate endRound when claiming token pools shares ([f094362](https://github.com/livepeer/livepeerjs/commit/f094362))
* **sdk:** Use default provider if config specifies a provider that is undefined ([7e09c5e](https://github.com/livepeer/livepeerjs/commit/7e09c5e))


### Features

* **apollo:** Added a defaultGas option ([41f8c44](https://github.com/livepeer/livepeerjs/commit/41f8c44))
* **apollo:** Added a new project for graphql-sdk integration into apollo-client ([050f2c6](https://github.com/livepeer/livepeerjs/commit/050f2c6))
* **apollo:** Option to pass provider via options ([3bff872](https://github.com/livepeer/livepeerjs/commit/3bff872))
* **chroma:** Added caching for Snapshot and better default styles for VideoPlayer ([187233f](https://github.com/livepeer/livepeerjs/commit/187233f))
* **chroma:** Added cropping and scaling to Snapshot component ([65e46ad](https://github.com/livepeer/livepeerjs/commit/65e46ad))
* **chroma:** Improved Snapshot updated logic ([8037d55](https://github.com/livepeer/livepeerjs/commit/8037d55))
* **chroma:** onLive and onDead callbacks ([f955277](https://github.com/livepeer/livepeerjs/commit/f955277))
* **explorer:** Add account broadcasting view ([1d8b554](https://github.com/livepeer/livepeerjs/commit/1d8b554))
* **explorer:** Added a deposit button ([17f70ab](https://github.com/livepeer/livepeerjs/commit/17f70ab))
* **explorer:** Added bonding modal that handles error/success states and unbond button ([1a932ff](https://github.com/livepeer/livepeerjs/commit/1a932ff))
* **explorer:** Added Navbar ([761ade9](https://github.com/livepeer/livepeerjs/commit/761ade9))
* **explorer:** Added tabs on profile page and began converting view into subview modules ([7b36e43](https://github.com/livepeer/livepeerjs/commit/7b36e43))
* **explorer:** Bonding modal ([23f0a1b](https://github.com/livepeer/livepeerjs/commit/23f0a1b))
* **explorer:** Electron build script ([8678197](https://github.com/livepeer/livepeerjs/commit/8678197))
* **explorer:** Fixed and updated transactions ([42f3587](https://github.com/livepeer/livepeerjs/commit/42f3587))
* **explorer:** Hook up transcoders view to graphQL ([1b6aad2](https://github.com/livepeer/livepeerjs/commit/1b6aad2))
* **explorer:** Humble beginnings of our browser-based protocol explorer ([31be3d6](https://github.com/livepeer/livepeerjs/commit/31be3d6))
* **explorer:** Integrate with MetaMask and add faucet actions for ETH and LPT ([2d6b186](https://github.com/livepeer/livepeerjs/commit/2d6b186))
* **explorer:** Polling account info ([5b77878](https://github.com/livepeer/livepeerjs/commit/5b77878))
* **explorer:** Pretty transcoder card, scroll position restoration when navigating, improved avatar ([2f93eee](https://github.com/livepeer/livepeerjs/commit/2f93eee))
* **explorer:** Super basic functioning Bonding button ([6a48e92](https://github.com/livepeer/livepeerjs/commit/6a48e92))
* **explorer:** Transcoder election view, and general UI update ([47bff97](https://github.com/livepeer/livepeerjs/commit/47bff97))
* **explorer:** Updated all Account subviews (overview, broadcasting, delegating, transcoding) ([1df196f](https://github.com/livepeer/livepeerjs/commit/1df196f))
* **graphql-sdk:** Added a me query ([a3349a7](https://github.com/livepeer/livepeerjs/commit/a3349a7))
* **graphql-sdk:** Added introspectionQueryResultData export ([66153c1](https://github.com/livepeer/livepeerjs/commit/66153c1))
* **graphql-sdk:** Added jobs() query parameter -- broadcasterWhereJobId ([97c631f](https://github.com/livepeer/livepeerjs/commit/97c631f))
* **graphql-sdk:** Added schemas for User, Broadcaster, Delegator, Transcoder, etc ([7b10ed8](https://github.com/livepeer/livepeerjs/commit/7b10ed8))
* **graphql-sdk:** Added token approve and bond mutations ([c0ff59f](https://github.com/livepeer/livepeerjs/commit/c0ff59f))
* **graphql-sdk:** Added transcoders() query and simplified project by removing interface types ([31f54d5](https://github.com/livepeer/livepeerjs/commit/31f54d5))
* **graphql-sdk:** Added unbond mutation ([1d34699](https://github.com/livepeer/livepeerjs/commit/1d34699))
* **graphql-sdk:** New project -- an isomorphic GraphQL API that can be used to simplify protocol ex ([2727eff](https://github.com/livepeer/livepeerjs/commit/2727eff))
* **graphql-sdk:** Support totalStake field in Transcoder type ([d6cc53a](https://github.com/livepeer/livepeerjs/commit/d6cc53a))
* **lpx:** Add -c, --config flag to console command ([c0b18bc](https://github.com/livepeer/livepeerjs/commit/c0b18bc))
* **lpx:** Integrated latest sdk and added support for config (.lpxrc) ([9dd7da1](https://github.com/livepeer/livepeerjs/commit/9dd7da1))
* **player:** Added favicons ([a2310bc](https://github.com/livepeer/livepeerjs/commit/a2310bc))
* **player:** Added polling and updated GraphQL query ([08d27a8](https://github.com/livepeer/livepeerjs/commit/08d27a8))
* **player:** Added support for services that export a saga ([9bfbf41](https://github.com/livepeer/livepeerjs/commit/9bfbf41))
* **player:** Integrated with graphql-sdk to create an ApolloClient instance, which greatly eases th ([e2d37c7](https://github.com/livepeer/livepeerjs/commit/e2d37c7))
* **player:** Updated UI to include social links and a simple landing page ([d5aa7e4](https://github.com/livepeer/livepeerjs/commit/d5aa7e4))
* **sdk:** Added new getBroadcaster method ([4a9c36e](https://github.com/livepeer/livepeerjs/commit/4a9c36e))
* **sdk:** getTranscoderTotalStake method ([23d7e51](https://github.com/livepeer/livepeerjs/commit/23d7e51))
* **sdk:** Wait for transaction receipts ([0262ff7](https://github.com/livepeer/livepeerjs/commit/0262ff7))
