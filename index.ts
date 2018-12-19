import * as http from "http";
import App from "./app";
const _moduleTag = "index";
const port = normalizePort(process.argv[3] || "8995");
App.set("port", port);
const server = http.createServer(App);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val: number|string): number|string|boolean {
    // tslint:disable-next-line:no-shadowed-variable
    let port: number = (typeof val === "string") ? parseInt(val, 10) : val;
    if (isNaN(port)) { return val; } else if (port >= 0) { return port; } else { return false; }
}

function onError(error: NodeJS.ErrnoException): void {
    const _funTag = _moduleTag + "_Push";
    if (error.syscall !== "listen") { throw error; }
    let bind = (typeof port === "string") ? "Pipe " + port : "Port " + port;
    switch (error.code) {
        case "EACCES":
            // logger.error(_funTag, `${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            // logger.error(_funTag, `${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
}
