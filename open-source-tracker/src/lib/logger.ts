import pino from "pino";

// Base logger configuration
const loggerConfig: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || "info",
};

// Only use pino-pretty in development and when not in Edge runtime
if (process.env.NODE_ENV === "development" && typeof window === "undefined" && !process.env.NEXT_RUNTIME) {
  loggerConfig.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
    },
  };
}

export const logger = pino(loggerConfig);