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



