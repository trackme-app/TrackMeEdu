const token = '3nNH6xJq6dn9FneZWoibBeNt';
const pino = require('pino');
const transport = pino.transport({
    targets: [
        {
            target: "@logtail/pino",
            options: {
                sourceToken: token,
                options: { endpoint: 'https://s1669018.eu-nbg-2.betterstackdata.com' }
            },
        },
        {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
                ignore: "pid,hostname",
            },
        }
    ],
});
const logger = pino(
    {
        level: process.env.LOG_LEVEL || "warn"
    },
    transport
);

export default logger;
