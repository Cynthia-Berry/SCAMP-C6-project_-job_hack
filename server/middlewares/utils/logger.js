/*** SOURCE: 1)https://www.npmjs.com/package/winston 2)https://www.youtube.com/watch?v=A5YiqaQbsyI ***/
const winston = require("winston");
const {createLogger, format, transports} = winston;
const {combine, colorize, timestamp, printf} = format;
const logLevel = 'debug';

/*Added color scheme to suit my application logger*/
winston.addColors({
	error: 'red',
	warn: 'yellow',
	info: 'cyan',
	debug: 'green'
});


/*Construct Log format*/
const logFormat = printf(({level, message, timestamp}) => {
	const ts = timestamp.slice(0, 19).replace('T', ' ');
	return `${ts}  ${level}: ${message}`;
});


/* Globally define necessary parameters needed for logging and monitoring */
const options = {
	file: {
		level: logLevel,
		filename: `${appRoot}/server/logs/`,
		handleExceptions: true,
		colorize: true,
		json: true,
		maxsize: 5242880,
		maxFiles: 5,
	},
	console: {
		format: combine(
			colorize(),
			timestamp(),
			logFormat,
		),
		level: logLevel,
		colorize: true,
		handleExceptions: true,
		json: false,
	}
};

/*Created method for Logger and Monitoring*/
const logger = createLogger({
	level: logLevel,
	format: winston.format.json(),
	transports: [
		new transports.File({filename: `${options.file.filename}error.log`, level: 'error'}),
		new transports.File({filename: `${options.file.filename}app.log`, level: 'info'}),
	],
	rejectionHandlers: [
		new transports.File({filename: `${options.file.filename}rejection.log`, level: 'warn'})
	]
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(new transports.Console(options.console));
}

module.exports = logger;
