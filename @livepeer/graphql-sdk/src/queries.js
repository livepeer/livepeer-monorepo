import { default as AccountFragment } from './schemas/Account/fragments'
import { default as BroadcasterFragment } from './schemas/Broadcaster/fragments'
import { default as DelegatorFragment } from './schemas/Delegator/fragments'
import { default as JobFragment } from './schemas/Job/fragments'
import { default as TranscoderFragment } from './schemas/Transcoder/fragments'

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
export const TranscoderQuery = `
${TranscoderFragment}
query TranscoderQuery($id: String!) {
  transcoder(id: $id) {
    ...TranscoderFragment
  }
}
`
