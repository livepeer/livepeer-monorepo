# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.0-alpha.5"></a>
# [1.0.0-alpha.5](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2018-06-28)


### Bug Fixes

* **Account:** Update account page when the Ethereum address is updated ([#90](https://github.com/livepeer/livepeerjs/issues/90)) ([6700a5c](https://github.com/livepeer/livepeerjs/commit/6700a5c)), closes [#82](https://github.com/livepeer/livepeerjs/issues/82)
* **explorer:** Check don't require round claim prior to bond when when unclaimed rounds < 20 ([ed21d9a](https://github.com/livepeer/livepeerjs/commit/ed21d9a)), closes [#61](https://github.com/livepeer/livepeerjs/issues/61)
* **explorer:** Check for web3 before accessing network version on account page ([b8c4e67](https://github.com/livepeer/livepeerjs/commit/b8c4e67))
* **explorer:** Don't require delegators to claim all rounds before bonding ([69aba5f](https://github.com/livepeer/livepeerjs/commit/69aba5f))
* **explorer:** Fix bond/unbond button on account page ([72ee49b](https://github.com/livepeer/livepeerjs/commit/72ee49b))
* **explorer:** Fix search on landing page ([f4bacbd](https://github.com/livepeer/livepeerjs/commit/f4bacbd)), closes [#93](https://github.com/livepeer/livepeerjs/issues/93)
* **explorer:** Fixed glitchy list rendering caused by overlaying <Drawer>s ([af9e320](https://github.com/livepeer/livepeerjs/commit/af9e320))
* **explorer:** Notifications scroll with the user's viewport ([7de70e9](https://github.com/livepeer/livepeerjs/commit/7de70e9))
* **explorer:** Only show withdraw stake button when delegator is in an unbonded state ([ee135d1](https://github.com/livepeer/livepeerjs/commit/ee135d1))
* **explorer:** Prevent unbond button from appearing when user is unable to bond ([e777536](https://github.com/livepeer/livepeerjs/commit/e777536))
* **explorer:** Skip bond approval when amount is 0, and always show bond button when authenticated ([ecd9805](https://github.com/livepeer/livepeerjs/commit/ecd9805))
* **explorer:** Unclaimed rounds should always be 0 when delegator is unbonded ([cfec64a](https://github.com/livepeer/livepeerjs/commit/cfec64a))
* Allow delegators to bond to another transcoder without going through unbonding waiting period ([#65](https://github.com/livepeer/livepeerjs/issues/65)) ([5ecf8d8](https://github.com/livepeer/livepeerjs/commit/5ecf8d8)), closes [#62](https://github.com/livepeer/livepeerjs/issues/62)
* **explorer:** Use number input for bond amount ([4606693](https://github.com/livepeer/livepeerjs/commit/4606693))
* **TranscoderCard:** New Protocol Restriction: Active Transcoders Can… ([#132](https://github.com/livepeer/livepeerjs/issues/132)) ([f72d618](https://github.com/livepeer/livepeerjs/commit/f72d618)), closes [#94](https://github.com/livepeer/livepeerjs/issues/94)


### Features

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


### BREAKING CHANGES

* **explorer:** graphql schema and sdk were updated
* **explorer:** Complete refactor or modals and form patterns




<a name="1.0.0-alpha.4"></a>
# [1.0.0-alpha.4](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2018-03-30)




**Note:** Version bump only for package @livepeer/explorer
