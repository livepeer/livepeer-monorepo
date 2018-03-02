import { compose } from 'recompose'
import {
  connectApproveMutation,
  connectBondMutation,
  connectTransactions,
  withBindToStatus,
} from '../../enhancers'

export default compose(
  connectApproveMutation,
  connectBondMutation,
  connectTransactions,
  withBindToStatus,
  // connectUnbondMutation,
)
