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
  const timeout = setTimeout(() => reject('timeout'), options.timeout || 10 * 1000);

  return fetch(url)
    .then(response => {
      clearTimeout(timeout);

      if (response.status === 200) {
        return resolve(response);
      }

      return reject(response);
    }, rejectReason => {
      clearTimeout(timeout);

      return reject(rejectReason);
    });
});