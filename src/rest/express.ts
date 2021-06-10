import express from "express";
import morgan from "morgan";
import * as bodyParser from 'body-parser';
import { getLogger } from 'log4js';
import { RestConfig } from "./server";
const cors = require('cors');
import createAppController from "./controllers/applications";
import createPrefsController from "./controllers/prefs";
import createLayoutsController from "./controllers/layouts";
import createConfigController from "./controllers/configs";

export default class ExpressApp {

    public express: express.Application;
    private logger = getLogger("express");

    constructor(private config: RestConfig) {
        this.logger.info('setting up express app...');

        this.express = express();
        this.middleware();
        this.routes();
        this.errors();
        this.logger.info('express app initialized');
    }

    private middleware(): void {
        this.express.use(cors());
        this.express.use(this.createMorgan());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {
        this.express.use("/apps", createAppController(this.config.store.applications));
        this.express.use("/layouts", createLayoutsController(this.config.layoutsFolder));
        this.express.use("/configs", createConfigController(this.config.configsFolder));    
        this.express.use("/prefs", createPrefsController(this.config.store.prefs));   
    }

    private createMorgan() {
        const format = `:remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length]`;
        var theAppLog = getLogger("access");
        return morgan(format, {
            "stream": {
                write: (str: string) => {
                    str = str.replace(/\r?\n|\r/g, "");
                    theAppLog.info(str);
                }
            }
        });
    }

    private errors() {
        this.express.use((error: Error, _req: any, res: any, _next: any) => {
            if (error.name === 'UnauthorizedError') {
                res.status(401).json({
                    error:
                    {
                        message: 'not authorized',
                        code: 401
                    }
                });
                return;
            }
            if (error.name === 'ValidationError') {
                res.status(400).json({
                    error:
                    {
                        message: error.message,
                        code: 400
                    }
                });
                return;
            }
            
            if ((error as any).auth0_code === "user_exists") {
                res.status(409).json({
                    error:
                    {
                        message: "User already exists",
                        code: 409
                    }
                });
                return;
                
            }

            this.logger.error('sever error', error);
            return res.status(500).json({
                error: {
                    message: "server error",
                    code: 500
                }
            });
        });
    }

}