const winston = require("winston");
const { format, transports } = winston;

const customLabels = {
  levels: {
    update: 0,
    socket: 1,
    select: 2,
    delete: 3,
    insert: 4,
    info: 5,
    warning: 4,
    error: 5,
    http: 0,
    verbose: 3,
  },
  colors: {
    update: "white",
    socket: "magenta",
    select: "gray",
    delete: "cyan",
    insert: "green",
    info: "yellow",
    warning: "bgRed",
    error: "red",
    http: "blue",
    verbose: "bgMagenta",
  },
};

const logger = winston.createLogger({
  levels: customLabels.levels,
  transports: [
    new winston.transports.Console({
      silent: false,
      format: winston.format.combine(
        // winston.format.simple(),
        winston.format.label({
          label: "[LOGGER]",
        }),
        winston.format.colorize({ all: true }),
        winston.format.timestamp({
          format: "YY-MM-DD HH:MM:SS",
        }),
        winston.format.printf(
          (info) =>
            ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
        )
      ),
    }),
  ],
});
winston.addColors(customLabels.colors);

// if (process.env.NODE_ENV !== "production") {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.simple(),
//         winston.format.colorize()
//       ),
//     })
//   );
// }

module.exports = logger;
