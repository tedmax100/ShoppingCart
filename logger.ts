import * as _path from "path";
import * as _winston from "winston";
require("winston-daily-rotate-file");

const logFolderPath = _path.resolve("./log/");
export const logger = _winston.createLogger({
    transports: [
        new _winston.transports.Console(),
        new _winston.transports.File({
            filename: logFolderPath + "/server.log",
            maxsize: 5242880, // 5MB
            maxFiles: 10,
            level: "debug",
       })
    ],
    // tslint:disable-next-line:object-literal-sort-keys
    exceptionHandlers: [
      new _winston.transports.File({
          filename: logFolderPath + "/error.log",
          maxsize: 5242880, // 5MB
          maxFiles: 20,
          level: "error",
        }),
    ],
});