import { Sync as SyncEvent } from '../types/UniswapV2Pair/UniswapV2Pair'
import { Protocol } from '../types/schema'
import { convertToDecimal } from '../../utils/helpers'

export function handleEthDaiSync(event: SyncEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  protocol.ethPrice = convertToDecimal(event.params.reserve0).div(convertToDecimal(event.params.reserve1))
  protocol.save()
}
