import express from "express";
import bodyParser from "body-parser";
import path from "path";
import apps from "./applications";
import layouts from "./layouts";
import configs from "./configs";

// configuration
const port = process.env.SERVER_PORT || 8004;
const configsFolder = process.env.CONFIGS_FOLDER || "./configuration/configs";
const layoutsFolder = process.env.LAYOUTS_FOLDER || "./configuration/layouts";
const appsFolder = process.env.APPS_FOLDER || "./configuration/apps";

// start express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(port, () => console.log(`Listening on ${port}. Will load apps from ${appsFolder}, layouts from ${layoutsFolder} and configs from ${configsFolder}`));

// start configs & apps & layouts
configs(app, configsFolder);
apps(app, appsFolder);
layouts(app, layoutsFolder);
