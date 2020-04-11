import { Express } from "express";
import util from "util";
import fs from "fs";
import path from "path";
import json5 from "json5";
import asyncHandler from "express-async-handler";
import { getUser } from "./utils";

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

export default function (app: Express, appsFolder: string) {
    app.get("/apps", asyncHandler(async (req, res, next) => {
        const user = getUser(req);
        try {
            const applications = await fetchConfigurations(user, appsFolder);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ applications: applications }));
        } catch (err) {
            next(err);
        }
    }));
}

const fetchConfigurations = async (user: string | undefined, appsFolder: string): Promise<FDC3AppDefinition[]> => {
    console.log(`fetching configurations for ${user}`);

    const files = await readDir(appsFolder);
    const fileContentsP = files.map(async fn => {
        return readFile(path.join(appsFolder, fn), "utf8")
            .then(c => json5.parse(c));
    });

    const fileContents = await Promise.all(fileContentsP);
    // each file can have single app definition or array
    return fileContents.reduce((acc: FDC3AppDefinition[], cfg) => {
        let configs: any | any[] = undefined;
        if (Array.isArray(cfg)) {
            configs = cfg.map(configToManifest);
        } else {
            configs = configToManifest(cfg);
        }
        return acc.concat(configs);
    }, []);

}

const configToManifest = (config: any): FDC3AppDefinition => {
    return {
        name: config.name,
        version: "1",
        title: config.title,
        manifestType: "Glue42",
        manifest: JSON.stringify(config)
    }
}

interface FDC3AppDefinition {
    name: string;
    version: "1";
    title: string;
    manifestType: "Glue42",
    manifest: string;
}