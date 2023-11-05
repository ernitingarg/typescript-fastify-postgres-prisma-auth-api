import pino from "pino";

export const logger = pino({
  options: {
    colorize: true,
  },
  level: "info",
  transport: {
    target: "pino-pretty",
  },
});
