# GraphQL SDK

[![home](https://img.shields.io/badge/%E2%97%80-home-lightgrey.svg?style=flat-square)](https://github.com/livepeer/livepeerjs)
[![npm](https://img.shields.io/npm/v/@livepeer/graphql-sdk.svg?style=flat-square)](https://www.npmjs.com/package/@livepeer/graphql-sdk)
[![Discord](https://img.shields.io/discord/423160867534929930.svg?style=flat-square)](https://discord.gg/7wRSUGX)
[![coverage](https://github.com/livepeer/livepeerjs/raw/master/packages/graphql-sdk/coverage.svg?sanitize=true)](https://codeclimate.com/github/livepeer/livepeerjs/code?q=packages%2Fgraphql-sdk%2Fsrc)
[![GitHub issues](https://img.shields.io/github/issues/livepeer/livepeerjs/graphql-sdk.svg?style=flat-square)](https://github.com/livepeer/livepeerjs/labels/graphql-sdk)

A GraphQL API that can be used to simplify protocol interaction. It can be used directly in the browser or in node.js applications.

<!-- hide-on-docup-start -->

## Table of Contents

* [Installation](#installation)
* [Schema Types](#schema-types)
  <!-- -   [API](#api) -->

<!-- hide-on-docup-stop -->

## Installation

```bash
yarn add @livepeer/graphql-sdk
```

<!-- START graphql-markdown -->

## Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

* [Query](#query)
* [Objects](#objects)
  * [Account](#account)
  * [Broadcaster](#broadcaster)
  * [Delegator](#delegator)
  * [Job](#job)
  * [JobProfile](#jobprofile)
  * [Mutation](#mutation)
  * [Round](#round)
  * [Transcoder](#transcoder)
* [Enums](#enums)
  * [DelegatorStatus](#delegatorstatus)
  * [TranscoderStatus](#transcoderstatus)
* [Scalars](#scalars)
  * [Boolean](#boolean)
  * [Int](#int)
  * [String](#string)

</details>

### Query

Contains all protocol data-fetching queries

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>account</strong></td>
<td valign="top"><a href="#account">Account</a></td>
<td>

An Account by ETH address

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>broadcaster</strong></td>
<td valign="top"><a href="#broadcaster">Broadcaster</a></td>
<td>

A Broadcaster by ETH address

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>delegator</strong></td>
<td valign="top"><a href="#delegator">Delegator</a></td>
<td>

A Delegator by ETH address

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>job</strong></td>
<td valign="top"><a href="#job">Job</a></td>
<td>

A Job by id

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>jobs</strong></td>
<td valign="top">[<a href="#job">Job</a>!]!</td>
<td>

A list of Jobs

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">broadcaster</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>me</strong></td>
<td valign="top"><a href="#account">Account</a></td>
<td>

The currently selected account (usually set by something like MetaMask)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>currentRound</strong></td>
<td valign="top"><a href="#round">Round</a></td>
<td>

Gets the current round

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transcoder</strong></td>
<td valign="top"><a href="#transcoder">Transcoder</a></td>
<td>

A Transcoder by ETH address

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transcoders</strong></td>
<td valign="top">[<a href="#transcoder">Transcoder</a>!]!</td>
<td>

A list of Transcoders

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
</tbody>
</table>

### Objects

#### Account

A type that describes a Livepeer account

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The ETH address for an account

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ethBalance</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The ETH balance for an account

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>tokenBalance</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The Livepeer Token (LPTU) balance for an account

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>broadcaster</strong></td>
<td valign="top"><a href="#broadcaster">Broadcaster</a>!</td>
<td>

The broadcaster info for an account

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>delegator</strong></td>
<td valign="top"><a href="#delegator">Delegator</a>!</td>
<td>

The delegator info for an account

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transcoder</strong></td>
<td valign="top"><a href="#transcoder">Transcoder</a>!</td>
<td>

The transcoder info for an account

</td>
</tr>
</tbody>
</table>

#### Broadcaster

Submit transcode jobs for live video streams.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The broadcaster's ETH address

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>deposit</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The broadcaster's ETH deposit (required to create a Job)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>withdrawBlock</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The earliest ETH block at which the broadcaster is eligible to withdraw their deposited ETH

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>jobs</strong></td>
<td valign="top">[<a href="#job">Job</a>!]!</td>
<td>

The jobs created by a broadcaster

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
</tbody>
</table>

#### Delegator

Users that bond tokens and delegate their bonded stake to other users, usually registered transcoders in exchange for shared rewards and fees.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The ETH address of a delegator

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>status</strong></td>
<td valign="top"><a href="#delegatorstatus">DelegatorStatus</a>!</td>
<td>

The status of a delegator

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>bondedAmount</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The amount of Livepeer Token a delegator has bonded

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fees</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The amount of fees a delegator has collected

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>delegateAddress</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The ETH address of the delegate (the one whom the delegator has bonded to)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>delegatedAmount</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The amount of Livepeer Token the delegator has delegated

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lastClaimRound</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The last round that the delegator claimed reward and fee pool shares

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>startRound</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The round the delegator becomes bonded and delegated to its delegate

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>withdrawRound</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The round the delegator can withdraw its stake.

</td>
</tr>
</tbody>
</table>

#### Job

A transcode job, created by a broadcaster

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Unique identifer for job

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>broadcaster</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Address of broadcaster that requested the transcoding job

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>profiles</strong></td>
<td valign="top">[<a href="#jobprofile">JobProfile</a>!]!</td>
<td>

Transcoding profiles associated with the job

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>streamId</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Unique identifier for the stream

</td>
</tr>
</tbody>
</table>

#### JobProfile

A job's transcoding profile

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The hashcode for the transcoding profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The name of the profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>bitrate</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The profile bitrate

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>framerate</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

The profile framerate

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>resolution</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The screen resolution of the profile

</td>
</tr>
</tbody>
</table>

#### Mutation

Contains all protocol transaction queries

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>approve</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

Approve an amount for an ERC20 token transfer

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">type</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">amount</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>bond</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

Submits a bond transaction for a previously approved amount

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">to</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">amount</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>claimEarnings</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

Claims earnings from your last claim round through specified round

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">endRound</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unbond</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

Submits a bond transaction for a previously approved amount

</td>
</tr>
</tbody>
</table>

#### Round

Submit transcode jobs for live video streams.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The round number

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>initialized</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td>

Whether the round was initialized

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lastInitializedRound</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The last previously initialized round

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>length</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The number of blocks this round lasts for

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>startBlock</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

When the round starts

</td>
</tr>
</tbody>
</table>

#### Transcoder

Perform transcoding work for the network. The transcoders with the most delegated stake are elected as active transcoders that process transcode jobs for the network.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The transcoder's ETH address

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>active</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td>

Whether or not the transcoder is active

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>status</strong></td>
<td valign="top"><a href="#transcoderstatus">TranscoderStatus</a>!</td>
<td>

The status of the transcoder

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lastRewardRound</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Last round that the transcoder called reward

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>rewardCut</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

% of block reward cut paid to transcoder by a delegator

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>feeShare</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

% of fees paid to delegators by transcoder

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pricePerSegment</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Price per segment for a stream (LPTU)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pendingRewardCut</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Pending block reward cut for next round if the transcoder is active

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pendingFeeShare</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Pending fee share for next round if the transcoder is active

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pendingPricePerSegment</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Pending price per segment for next round if the transcoder is active

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>totalStake</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Total tokens delegated toward a transcoder (including their own)

</td>
</tr>
</tbody>
</table>

### Enums

#### DelegatorStatus

The possible statuses of a delegator

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>Pending</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>Bonded</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>Unbonding</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>Unbonded</strong></td>
<td></td>
</tr>
</tbody>
</table>

#### TranscoderStatus

The possible statuses of a transcoder

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>NotRegistered</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>Registered</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>Resigned</strong></td>
<td></td>
</tr>
</tbody>
</table>

### Scalars

#### Boolean

The `Boolean` scalar type represents `true` or `false`.

#### Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.

#### String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

<!-- END graphql-markdown -->
