import { GraphQLSchema } from 'graphql'
import Query from './Query'
import AccountType from './AccountType'
import BroadcasterType from './BroadcasterType'
import DelegatorType from './DelegatorType'
import JobType from './JobType'
import TranscoderType from './TranscoderType'
import DelegatorStatus from './DelegatorStatus'
import TranscoderStatus from './TranscoderStatus'
import JobProfileType from './JobProfileType'

export default new GraphQLSchema({
  query: Query,
  types: [
    AccountType,
    BroadcasterType,
    DelegatorStatus,
    DelegatorType,
    JobProfileType,
    JobType,
    TranscoderStatus,
    TranscoderType,
  ],
})
