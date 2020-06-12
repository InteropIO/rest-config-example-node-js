import { Express } from "express";
import util from "util";
import fs from "fs";
import path from "path";
import json5 from "json5";
import { getUser, getRegionEnvFolder } from "./utils";

const readFile = util.promisify(fs.readFile);

export default function(app: Express, rootFolder: string) {
    app.get('/configs', (req, res, next) => {
        const user = getUser(req);
        const config = req.header("config");
        const filePath = path.join(getRegionEnvFolder(req, rootFolder), `${config}.json`);
        fetchConfigurations(user, filePath)
            .then(configs => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(configs));
            }).catch(error => {
                res.status(500);
                console.log(error);
                res.send(JSON.stringify(error));
            })
    });


    async function fetchConfigurations(user: string, filePath: string) {
        console.log(`${new Date().toLocaleTimeString()} fetching ${filePath} configuration for ${user}...`);
        return await readFile(path.join(filePath), 'utf8').then(json5.parse);
    }
}

