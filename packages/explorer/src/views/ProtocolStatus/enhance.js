import { compose } from 'recompose'
import {
  connectCurrentBlockQuery,
  connectCurrentRoundQuery,
} from '../../enhancers'

export default compose(
  connectCurrentBlockQuery,
  connectCurrentRoundQuery,
)
