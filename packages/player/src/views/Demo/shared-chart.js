export const timeFormat = ms => {
  const sec = Math.floor(ms / 1000)
  const m = Math.floor(sec / 60)
  let s = `${sec - m * 60}`
  while (s.length < 2) {
    s = '0' + s
  }
  return `${m}:${s}`
}
