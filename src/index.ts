import { FileBasedStore } from "./stores/file/store";
import setupLogging from "./logging";
import { Logger, getLogger } from "log4js";
import RestServer from "./rest/server";

// configuration
const port = Number(process.env.SERVER_PORT || 8004);
const configsFolder = process.env.CONFIGS_FOLDER || "./configuration/configs";
const layoutsFolder = process.env.LAYOUTS_FOLDER || "./configuration/layouts";
const appsFolder = process.env.APPS_FOLDER || "./configuration/apps";

const start = async () => {

    const trapErrors = (logger: Logger) => {
        process.on("uncaughtException", function (err) {
            logger.error("uncaught error", err);
        });
    }
    setupLogging();

    const logger = getLogger("index");
    logger.info("====== Glue42 Config Service ====================================");

    trapErrors(logger);   

    const store = new FileBasedStore();

    // startup REST server
    const server: RestServer = new RestServer({ port, store, configsFolder, layoutsFolder });
    server.start();
}

start();
