import winston from "winston";
import path from "path";

const { combine, timestamp, printf, colorize } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return ` [${level}] ${timestamp}: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
      new winston.transports.Console({ format: combine(colorize(), timestamp(), logFormat) }),
      new winston.transports.File({ filename: path.join("logs", "error.log"), level: "error" }),
      new winston.transports.File({ filename: path.join("logs", "combined.log") }),
    ],
});

export default logger;