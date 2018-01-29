import { default as AccountFragment } from './fragments/Account'
import { default as BroadcasterFragment } from './fragments/Broadcaster'
import { default as DelegatorFragment } from './fragments/Delegator'
import { default as JobFragment } from './fragments/Job'
import { default as TranscoderFragment } from './fragments/Transcoder'

export const AccountQuery = `
${AccountFragment}
${BroadcasterFragment}
${DelegatorFragment}
${TranscoderFragment}
query AccountQuery($id: String!) {
  account(id: $id) {
    ...AccountFragment
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
