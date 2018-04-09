# Contributing to LivepeerJS

Hey there, potential contributor!

Thanks for your interest in this project. Every contribution is welcome and appreciated. We're super excited to help you to get started 😎

> **Note:** If you still have questions after reading through this guide, [open an issue](https://github.com/livepeer/livepeerjs/issues) or [talk to us on Discord](https://discordapp.com/invite/7wRSUGX).

## Getting Started

First off, here are a few important notes:

* **Read the [Code of Conduct](https://github.com/livepeer/livepeerjs/blob/master/CODE_OF_CONDUCT.md).** For most, this will be common sense. But please take a couple minutes to understand your responsibilities as a member of the LivepeerJS community and how you are expected to treat others.
* **[Yarn](https://yarnpkg.com/en/) is the npm client used in this project.** Please do not use `npm` or you will encounter issues.
* **This is a monorepo.** This means several public and private packages are contained within this single repository. Do your best to isolate your code changes to a single subpackage for each commit.
* **Packages use fixed-versioning.** When packages are published, their version numbers are synchronized. Perhaps we could switch over to independent versioning at some point, but this approach was simpler for getting started.
* **Version numbers and changelogs are scripted.** Conveniently, there's no need to manually update any changelogs or package versions manually. This is all managed under-the-hood by commitizen when maintainers create a new release.
* **Always be rebasing.** We tend to prefer a nice linear trail of commits in our Git history. Merge commits throw that off and make us 😰😰😰. To minimize conflicts, please `git rebase origin/master` often. And if your fork is far behind HEAD, consider deleting it and re-forking or using [`git rebase --onto`](https://stackoverflow.com/a/29916361).
* **There are a couple fancy precommit hooks:**.
  * **Style linting.** This gets handled by prettier. So you don't have to count the number of spaces or tabs your are using when you code, etc.
  * **Commit message formatting.** We use the conventional commit format. Because it can be annoying to type out manually, you can simply run `yarn cz` whenever you are ready to commit your staged files.

### Next Steps...

For many, the best way to get started is to do one of the following:

* **Improve documentation.** This could be as simple as adding some extra notes to a README.md file, or as complex as creating some new npm scripts to generate docs. Either way, we'd really really love your help with this 💖.
* **Get involved in issues** - Many issues are open discussions. Feel free to add your own concerns, ideas, and workarounds. If you don't see what you're looking for, you can always create a new issue
* **Submit a PR.** If you're into this whole coding thing, maybe try picking up [a good first issue](https://github.com/livepeer/livepeerjs/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). Please be sure to carefully read each package's README.md file and familiarze yourself with the project layout.

### Useful Tools

Although not required, you may want to download/install some or all of the following tools, before jumping into development:

* [Flow Language Support](https://marketplace.visualstudio.com/items?itemName=flowtype.flow-for-vscode) - If you use VS Code, you can get it to play nice with Flow types by installing this language support extension.
* [Code Climate Browser Extension](https://codeclimate.com/browser-extension/) - We recommend installing the Code Climate browser extension to allow for better insights into code quality and coverage while browsing the packages in this repository:
* [MetaMask](https://metamask.io/) - This extension manages Ethereum accounts and transactions in your browser. It's useful if you want to submit ETH transactions or switch between RPC providers.
* [Cipher](https://www.cipherbrowser.com/) - A mobile browser that manages Ethereum accounts and transactions. It's good for testing out dApps on your phone or tablet.
