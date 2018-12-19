import * as bodyParser from "body-parser";
import express from "express";
import {NextFunction, Request, RequestHandler, Response, ErrorRequestHandler } from "express";
import * as helmet from "helmet";
import { userRouter } from "./controller/user";
import { cartRouter } from "./controller/cart";
const _moduleTag = "App";
// Creates and configures an ExpressJS web server.
class App {
    public express: express.Application;

    /**
     * Configure Express middleware.
     */
    constructor() {
        // -->Init: routes
        this.express = express();
        this.middleware();
        this.routes();
        this.express.use(this.errorHandler);
        // todo: prepare your db here
    }
    private middleware(): void {
        this.express.use(helmet.default());
        this.express.use(bodyParser.json());
       /*  this.express.use(bodyParser.urlencoded({ extended: false})); */
    }

    /**
     * Load all API endpoints
     *      -- create route endpoints here
     *      -- check the sample
     */
    private routes(): void {
        this.express.use("/user", userRouter);
        this.express.use("/cart", cartRouter);
    }

    // error handler
    private errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
      
        res.status(err.status || 500).end();
    }
    /* app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
    
      res.status(err.status || 500).end();
    }); */
}

// tslint:disable-next-line:no-default-export
export default new App().express;
