import { randomBytes } from 'crypto'
import anyBase from 'any-base'

const BASE_36 = 'abcdefghijklmnopqrstuvwxyz0123456789'
const SEGMENT_COUNT = 3
const SEGMENT_LENGTH = 4
const hexToBase36 = anyBase(anyBase.HEX, BASE_36)

/**
 * Securely generate a stream key of a given length. Goals for stream keys: be reasonably secure
 * but also easy to type if necessary. Base36 facilitates this.
 *
 * Returns stream keys of the form XXXX-XXXX-XXXX in Base66.
 */
export async function generateStreamKey() {
  return new Promise((resolve, reject) => {
    randomBytes(256, (err, buf) => {
      if (err) {
        return reject(err)
      }
      const raw = hexToBase36(buf.toString('hex'))
      let result = ''
      const TOTAL_LENGTH = SEGMENT_COUNT * SEGMENT_LENGTH
      for (let i = 0; i < TOTAL_LENGTH; i += 1) {
        result += raw[i]
        if ((i + 1) % SEGMENT_LENGTH === 0 && i < TOTAL_LENGTH - 1) {
          result += '-'
        }
      }
      resolve(result)
    })
  })
}

generateStreamKey().then(x => console.log(x))
