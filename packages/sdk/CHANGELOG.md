# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.0-alpha.5"></a>
# [1.0.0-alpha.5](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2018-06-28)


### Bug Fixes

* Change signing module to ethereumjs-tx for replay protection ([#53](https://github.com/livepeer/livepeerjs/issues/53)) ([2f4536f](https://github.com/livepeer/livepeerjs/commit/2f4536f))
* **explorer:** Prevent unbond button from appearing when user is unable to bond ([e777536](https://github.com/livepeer/livepeerjs/commit/e777536))


### Code Refactoring

* **sdk:** Updated default address and provider to point towards mainnet ([103d19d](https://github.com/livepeer/livepeerjs/commit/103d19d))


### Features

* **explorer:** Add pending stake and fees, transfer allowance approval form ([7531761](https://github.com/livepeer/livepeerjs/commit/7531761)), closes [#54](https://github.com/livepeer/livepeerjs/issues/54)
* **sdk:** Added utils for parsing tx receipts ([6c63b2a](https://github.com/livepeer/livepeerjs/commit/6c63b2a))


### BREAKING CHANGES

* **explorer:** graphql schema and sdk were updated
* **sdk:** claimEarnings returns tx hash rather than tx receipt
* **sdk:** The SDK will now use mainnet by default for querying data and submitting
transactions




<a name="1.0.0-alpha.4"></a>
# [1.0.0-alpha.4](https://github.com/livepeer/livepeerjs/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2018-03-30)




**Note:** Version bump only for package @livepeer/sdk
