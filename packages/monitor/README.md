# Livepeer Monitor

[![Discord](https://img.shields.io/discord/423160867534929930.svg?style=flat-square)](https://discord.gg/7wRSUGX)
[![GitHub issues](https://img.shields.io/github/issues/livepeer/livepeerjs/monitor.svg?style=flat-square)](https://github.com/livepeer/livepeerjs/labels/monitor)

This is a little script that monitors the Livepeer subgraph and informs a human
on Discord if it's falling behind.

For simplicity of deployment, `yarn run deploy:build` builds it into a single
JavaScript file including all dependencies with Parcel.

If you're looking to customize it for your purposes, check out the variables in
`src/config.js`.
