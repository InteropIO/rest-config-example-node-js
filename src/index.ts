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
    // if (!readConfigs(logger)) {
    //     return;
    // }

    // const pouch = new PouchController();
    // const dbPath = process.env.db || "./db";
    // let options;
    // if (process.env.username) {
    //     options = {
    //         auth: {
    //             username: process.env.username,
    //             password: process.env.password
    //         }
    //     }
    // }

    // await pouch.init(dbPath, options);

    // const logic = new Logic(pouch, getToken, createUser);

    // const config = new Config();

    // seed the database
    // await seed(logic);

    const store = new FileBasedStore();

    // startup REST server
    const server: RestServer = new RestServer({ port, store, configsFolder, layoutsFolder });
    server.start();
}

start();


// // start express
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.listen(port, () => console.log(`Listening on ${port}. Will load apps from ${appsFolder}, layouts from ${layoutsFolder} and configs from ${configsFolder}`));


// // start configs & apps & layouts
// configs(app, configsFolder);
// apps(app, store.applications);
// layouts(app, layoutsFolder);
