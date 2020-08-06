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

export const fetchWithTimeout = (url, options) => new Promise((resolve, reject) => {
  let timeout = setTimeout(() => {
    timeout = null;
    reject('timeout');
  }, options.timeout || 10 * 1000);
  return fetch(url, options)
    .then(response => {
      if (timeout === null) {
        // already timed out
        return;
      }
      clearTimeout(timeout);
      return resolve(response)
    }, rejectReason => {
      if (timeout === null) {
        // already timed out
        return;
      }
      clearTimeout(timeout);
      return reject(rejectReason);
    });
});