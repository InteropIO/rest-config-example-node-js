import { Router } from "express";
import util from "util";
import fs from "fs";
import path from "path";
import json5 from "json5";
import { getUser } from "../../utils";

const readFile = util.promisify(fs.readFile);

export default (rootFolder: string): Router => {
    const router: Router = Router();
    router.get('/', (req, res, next) => {
        const user = getUser(req);
        const config = req.header("config");
        const filePath = path.join(rootFolder, `${config}.json`);
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

    return router;
}
