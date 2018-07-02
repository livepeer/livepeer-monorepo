import { default as AccountFragment } from './fragments/Account'
import { default as BlockFragment } from './fragments/Block'
import { default as BroadcasterFragment } from './fragments/Broadcaster'
import { default as DelegatorFragment } from './fragments/Delegator'
import { default as JobFragment } from './fragments/Job'
import { default as RoundFragment } from './fragments/Round'
import { default as TransactionFragment } from './fragments/Transaction'
import { default as TranscoderFragment } from './fragments/Transcoder'
import { default as ProtocolFragment } from './fragments/Protocol'

export const AccountQuery = `
${AccountFragment}
${BroadcasterFragment}
${DelegatorFragment}
${TranscoderFragment}
query AccountQuery($id: String) {
  account(id: $id) {
    ...AccountFragment
  }
}
`

export const AccountBroadcasterQuery = `
${JobFragment}
${BroadcasterFragment}
query AccountBroadcasterQuery($id: String, $jobs: Boolean!, $jobsSkip: Int, $jobsLimit: Int) {
  account(id: $id) {
    id
    ensName
    broadcaster {
      ...BroadcasterFragment
      jobs(skip: $jobsSkip, limit: $jobsLimit) @include(if: $jobs) {
        ...JobFragment
      }
    }
  }
}
`

export const BroadcasterQuery = `
${BroadcasterFragment}
${JobFragment}
query BroadcasterQuery($id: String!, $jobs: Boolean!, $jobsSkip: Int, $jobsLimit: Int) {
  broadcaster(id: $id) {
    ...BroadcasterFragment
    jobs(skip: $jobsSkip, limit: $jobsLimit) @include(if: $jobs) {
      ...JobFragment
    }
  }
}
`

export const CoinbaseQuery = `
query CoinbaseQuery {
  coinbase
}
`

export const CurrentBlockQuery = `
${BlockFragment}
query CurrentBlockQuery {
  currentBlock {
    ...BlockFragment
  }
}
`

export const CurrentRoundQuery = `
${RoundFragment}
query CurrentRoundQuery {
  currentRound {
    ...RoundFragment
  }
}
`

export const DelegatorQuery = `
${DelegatorFragment}
query DelegatorQuery($id: String!) {
  delegator(id: $id) {
    ...DelegatorFragment
  }
}
`

export const JobQuery = `
${JobFragment}
query JobQuery($id: String!) {
  job(id: $id) {
    ...JobFragment
  }
}
`

export const JobsQuery = `
${JobFragment}
query JobsQuery($broadcaster: String, $skip: Int, $limit: Int) {
  jobs(broadcaster: $broadcaster, skip: $skip, limit: $limit) {
    ...JobFragment
  }
}
`

export const MeQuery = `
${AccountFragment}
${BroadcasterFragment}
${DelegatorFragment}
${TranscoderFragment}
query MeQuery {
  me {
    ...AccountFragment
  }
}
`

export const TransactionsQuery = `
${TransactionFragment}
query TransactionQuery(
  $address: String!,
  $startBlock: String,
  $endBlock: String,
  $skip: String,
  $limit: String,
  $sort: String
) {
  transactions(
    address: $address,
    startBlock: $startBlock,
    endBlock: $endBlock,
    skip: $skip,
    limit: $limit,
    sort: $sort,
  ) {
    ...TransactionFragment
  }
}
`

export const TranscoderQuery = `
${TranscoderFragment}
query TranscoderQuery($id: String!) {
  transcoder(id: $id) {
    ...TranscoderFragment
  }
}
`

export const TranscodersQuery = `
${TranscoderFragment}
query TranscodersQuery($skip: Int, $limit: Int) {
  transcoders(skip: $skip, limit: $limit) {
    ...TranscoderFragment
  }
}
`

export const ProtocolQuery = `
${ProtocolFragment}
query ProtocolQuery {
  protocol {
    ...ProtocolFragment
  }
}`
