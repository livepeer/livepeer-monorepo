export const timeout = (ms, fn) => {
  return new Promise((resolve, reject) => {
    const handle = setTimeout(() => {
      reject(Error('timed out'))
    }, ms)

    fn().then((...ret) => {
      clearTimeout(handle)
      resolve(...ret)
    })
  })
}

/**
 * Returns the input array, shuffled.
 */
export const shuffle = (arr) => {
  const randos = arr.map(() => Math.random())
  return Object.keys(arr)
    .sort((idx1, idx2) => {
      return randos[idx1] - randos[idx2]
    })
    .map((idx) => arr[idx])
}
