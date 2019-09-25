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
