# Contributing to LivepeerJS

Hey there, potential contributor!

Thanks for your interest in this project. Every contribution is welcome and appreciated. We're super excited to help you to get started 😎

> **Note:** If you still have questions after reading through this guide, [open an issue](https://github.com/livepeer/livepeerjs/issues) or [talk to us on Discord](https://discordapp.com/invite/7wRSUGX).

## Getting Started

First off, here are a few important notes:

* **Read the [Code of Conduct](https://github.com/livepeer/livepeerjs/blob/master/CODE_OF_CONDUCT.md).** For most, this will be common sense. But please take a couple minutes to understand your responsibilities as a member of the LivepeerJS community and how you are expected to treat others.
* **[Yarn](https://yarnpkg.com/en/) is the npm client used in this project.** Please do not use `npm` or you will encounter issues.
* **This is a monorepo.** This means several public and private packages are contained within this single repository. Do your best to isolate your code changes to a single subpackage for each commit.
* **We use Flow for type annotations.** While not required, please try your best to add type annotations for new code. And definitely try not to break typechecks for existing code.
* **Packages use fixed-versioning.** When packages are published, their version numbers are synchronized. Perhaps we could switch over to independent versioning at some point, but this approach was simpler for getting started.
* **Version numbers and changelogs are scripted.** Conveniently, there's no need to manually update any changelogs or package versions manually. This is all managed under-the-hood by commitizen when maintainers create a new release.
* **Always be rebasing.** We tend to prefer a nice linear trail of commits in our Git history. Merge commits throw that off and make us 😰😰😰. To minimize conflicts, please `git rebase origin/master` often. And if your fork is far behind HEAD, consider deleting it and re-forking or using [`git rebase --onto`](https://stackoverflow.com/a/29916361).
* **There are a couple fancy precommit hooks:**.
  * **Style linting.** This gets handled by prettier. So you don't have to count the number of spaces or tabs your are using when you code, etc.
  * **Commit message formatting.** We use the conventional commit format. Because it can be annoying to type out manually, you can simply run `yarn cz` whenever you are ready to commit your staged files.

### How You Can Help

LivepeerJS contributions will generally fall into one of the following categories:

#### 📖 Updating documentation

This could be as simple as adding some extra notes to a README.md file, or as complex as creating some new `package.json` scripts to generate docs. Either way, we'd really really love your help with this 💖.

#### 💬 Getting involved in issues

Many issues are open discussions. Feel free to add your own concerns, ideas, and workarounds. If you don't see what you're looking for, you can always open a new issue.

#### 🐞 Fixing bugs, 🕶️ adding feature/enhancements, or 👌 improving code quality

If you're into this whole coding thing, maybe try picking up [a good first issue](https://github.com/livepeer/livepeerjs/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). If picking up issues isn't your thing, no worries. You can always add more tests to improve coverage or refactor code to increase maintainability. Check out Code Climate for some insight into [code quality & coverage](https://codeclimate.com/github/livepeer/livepeerjs/issues) on a file-by-file basis. Whatever you do, be sure to check out the section about [useful tools](#useful-tools).

> Note: Bonus points if you can delete code instead of adding it! 👾

#### 🛠️ Improving scripts and tooling

We want to make sure LivepeerJS contributors have a pleasant developer experience (DX). The tools we use to code continually change and improve. If you see ways to reduce the amount of repetition or stress when it comes to coding in this project, feel free to create an issue and/or PR to discuss. Let's continue to improve this codebase for everyone.

> Note: These changes generally affect multiple packages, so you'll probably want to be familiar with each project's layout and conventions. Because of this additional cognitive load, you may not want to begin here for you first contribution.

## FAQ

### How much do I need to know about peer-to-peer/livestreaming/dApps/GraphQL/React/etc to be an effective contributor?

Nothing actually! We expect a rich mixture of commits, conversation, support, and review. Adding documentation or opening issues are incredibly useful ways to get involved without coding at all. If you do want to contribute code, however, it'd be good to have some proficiency with JavaScript.

### How is a contribution reviewed and accepted?

* If you are opening an issue, please follow the [ISSUE_TEMPLATE](https://raw.githubusercontent.com/livepeer/livepeerjs/master/ISSUE_TEMPLATE.md) format before submitting. And please _keep your issue simple, clear, and to-the-point_. Most issues do not require many paragraphs of text. In fact, if you write too much, it can become difficult to understand what you are actually trying to communicate.

* If you are submitting a pull request
  * Write tests to increase code coverage
  * Tag the issue(s) your PR is closing or relating to
  * Make sure your PR is up-to-date with `origin/master` (rebase please 🙏)

Code reviews happen each week, so a PR that follows these guidelines will probably get merged quickly if there aren't any major problems with the implementation (we try to watch out for code duplication/complexity). CoacoaPods has [some really useful tips](https://github.com/CocoaPods/CocoaPods/wiki/Communication-&-Design-Rules#design-rules) when it comes to coding. I highly recommend taking a look 🤓.

### When is it appropriate to follow up?

You can expect a response from a maintainer within 7 days. If you haven’t heard anything by then, feel free to ping the thread.

### How much time is spent on this project?

Currently, there is a single full-time maintainer dedicated to this project and all of its public/private packages.

### What types of contributions are accepted?

All of the types outlined in [How You Can Help](#how-you-can-help).

### What happens if my suggestion or PR is not accepted?

While it's unlikely, sometimes there's no acceptable way to implement a suggestion or merge a PR. If that happens, maintainer will still...

* Thank you for your contribution.
* Explain why it doesn’t fit into the scope of the project and offer clear suggestions for improvement, if possible.
* Link to relevant documentation, if it exists.
* Close the issue/request.

But do not despair! In many cases, this can still be a great opportunity to follow-up with an improved suggestion or pull request. Worst case, this repo is open source, so forking is always an option 😎.

## Useful Tools

Although not required, you may want to download/install some or all of the following tools, before jumping into development:

* [Flow Language Support](https://marketplace.visualstudio.com/items?itemName=flowtype.flow-for-vscode) - If you use VS Code, you can get it to play nice with Flow types by installing this language support extension.
* [Code Climate Browser Extension](https://codeclimate.com/browser-extension/) - We recommend installing the Code Climate browser extension to allow for better insights into code quality and coverage while browsing the packages in this repository:
* [MetaMask](https://metamask.io/) - This extension manages Ethereum accounts and transactions in your browser. It's useful if you want to submit ETH transactions or switch between RPC providers.
* [Cipher](https://www.cipherbrowser.com/) - A mobile browser that manages Ethereum accounts and transactions. It's good for testing out dApps on your phone or tablet.
