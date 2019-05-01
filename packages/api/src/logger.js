import * as log from 'loglevel'
log.setDefaultLevel('info')
export default log

// Winston can't be parcel packed, so we're using loglevel instead

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
