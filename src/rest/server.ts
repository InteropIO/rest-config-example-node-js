import ExpressApp from './express';

import { getLogger } from 'log4js';
import * as http from 'http';
import { Store } from '../stores/store';

export interface RestConfig{
    port: number;
    store: Store;
    configsFolder: string;
    layoutsFolder: string;
}

export default class RestServer {

    private logger = getLogger("rest");
    private server!: http.Server;
    private port: number;
    private app: ExpressApp;

    constructor(private config: RestConfig) {
        this.app = new ExpressApp(config);
        this.port = this.config.port;
    }

    public start() {        
        this.logger.info(`starting server on port ${this.port}...`);
        this.app.express.set('port', this.port);

        this.server = http.createServer(this.app.express);
        this.server.listen(this.port);
        this.server.on('error', (e) => this.onError(e));
        this.server.on('listening', this.onListening.bind(this));
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') {
            this.logger.error('error', error);
            throw error;
        }

        let bind = (typeof this.port === 'string') ? 'Pipe ' + this.port : 'Port ' + this.port;
        switch (error.code) {
            case 'EACCES':
                this.logger.error(`${bind} requires elevated privileges`, error);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                this.logger.error(`${bind} is already in use`, error);
                process.exit(1);
                break;
            default:
                this.logger.error('error', error);
                throw error;
        }
    }

    private onListening(): void {
        let addr = this.server.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr?.port}`;
        this.logger.info(`server started on ${bind}`);
    }
}