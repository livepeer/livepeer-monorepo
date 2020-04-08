// import winston from 'winston'

// export default winston.createLogger({
//   format: winston.format.combine(
//     winston.format.colorize(),
//     winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//     winston.format.align(),
//     winston.format.printf(info => {
//       const { timestamp, level, message, ...extra } = info

//       return `${timestamp} [${level}]: ${message} ${
//         Object.keys(extra).length ? JSON.stringify(extra, null, 2) : ''
//       }`
//     }),
//   ),
//   transports: [new winston.transports.Console()],
// })

export default {
  info(...args) {
    console.log(...args)
  },
  error(...args) {
    console.error(...args)
  },
  warn(...args) {
    console.warn(...args)
  },
}
