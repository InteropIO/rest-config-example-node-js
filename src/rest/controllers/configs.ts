import { Router } from "express";
import asyncHandler from "express-async-handler";
import util from "util";
import fs, { existsSync, promises } from "fs";
import path from "path";
import json5 from "json5";
import { getUser } from "../../utils";
import deepmerge from "deepmerge";

const readFile = util.promisify(fs.readFile);
const arrayConfigs = ["themes", "channels"];

export default (rootFolder: string): Router => {
    const router: Router = Router();
    router.get('/', asyncHandler(async (req, res, next) => {
        const user = getUser(req);

        // get from header OR from request param OR from legacy config (3.10)
        let configsR: string = req.header("configs") ?? req.query.configs as string ?? req.header("config") ?? "*";
        let configs: string[] = [];
        if (configsR === "*") {
            configs = await getAvailableConfigFiles();
        } else {
            configs = configsR.split(",");
        }

        const result: any = {};
        if (configs) {
            for (const config of configs) {
                try {
                    result[config] = await fetchConfiguration(user, config);
                } catch (e) {
                    // TODO log
                    result[config] = undefined;
                }
            }
        }
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }));

    async function fetchConfiguration(user: string, configName: string) {
        const isArrayResult = arrayConfigs.includes(configName);
        const results = await Promise.all([
            readConfigFile(configName, isArrayResult),
            readConfigFile(`${configName}-${user}`, isArrayResult)
        ]);

        if (isArrayResult) {
            return mergeArrays(results[0], results[1]);
        }
        return deepmerge(results[0], results[1], { arrayMerge: arrayMergeUseSource });
    }

    async function readConfigFile(configName: string, arrayResult = false) {
        let defaultResult: any = {};
        // check if themes OR themes-
        if (arrayResult) {
            defaultResult = [];
        }
        try {
            const filePath = path.join(rootFolder, `${configName}.json`);
            if (!existsSync(filePath)) {
                return defaultResult;
            }
            return await readFile(path.join(filePath), 'utf8').then(json5.parse);
        } catch {
            return defaultResult;
        }
    }

    async function getAvailableConfigFiles() {
        let names: string[] = [];
        try {
            names = await promises.readdir(rootFolder);
            names = names
                .filter(n => n.endsWith(".json") && !n.includes("-"))
                .map(f => f.replace(".json", ""));
        } catch (e) {
            // TODO log
        }

        if (names === undefined) {
            names = [];
        }
        return names;
    }

    function mergeArrays(target: any[], source: any[]) {

        if (!target) {
            return source;
        }
        if (!source) {
            return target;
        }
        if (!target[0]?.name) {
            // if the array objects lack name prop, just return the second
            return source;
        }

        // if array items have name property, treat them as keyed by name, 
        // which means that a item with the same name should be merged over
        const targetAsObject = target.reduce((prev, current) => {
            prev[current.name] = current;
            return prev;
        }, {});

        const sourceAsObject = source.reduce((prev, current) => {
            prev[current.name] = current;
            return prev;
        }, {});

        const merged: Object = deepmerge(targetAsObject, sourceAsObject, { arrayMerge: arrayMergeUseSource });

        return Object.values(merged);
    }

    const arrayMergeUseSource = (_: any[], source: []) => source;

    return router;
}

