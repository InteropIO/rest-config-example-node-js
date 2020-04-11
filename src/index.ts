import express from "express";
import bodyParser from "body-parser";
import apps from "./applications";
import layouts from "./layouts";

// configuration
const port = process.env.SERVER_PORT || 8004;
const layoutsFolder = process.env.LAYOUTS_FOLDER || "./configuration/layouts";
const appsFolder = process.env.APPS_FOLDER || "./configuration/apps";

// start express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(port, () => console.log(`Listening on ${port}. Will load apps from ${appsFolder} and layouts from ${layoutsFolder}`));

// start apps & layouts
apps(app, appsFolder);
layouts(app, layoutsFolder);
