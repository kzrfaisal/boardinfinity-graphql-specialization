const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'error',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: 'logs/error.log' }),
    new transports.Console(),
  ],
});

module.exports = logger;
