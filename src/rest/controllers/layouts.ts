import { Express, Router } from "express";
import fs from "fs";
import path from "path";
import util from "util";
import asyncHandler from "express-async-handler";
import { getUser } from "../../utils";

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

export default (layoutsFolder: string): Router => {
    const router: Router = Router();
    const defaultFilePath = path.join(layoutsFolder, "default.layout");

    router.get("/layouts", asyncHandler(async (req, res, next) => {
        const user = getUser(req);
        const layouts = await fetchLayoutsConfigurations(user);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ layouts }));
    }));

    router.post("/layouts", asyncHandler(async (req, res, next) => {
        const user = getUser(req);
        const layout = req.body.layout;
        console.log(`saving layout ${layout.name} (${layout.type}) for user ${user}`);

        const file = path.join(layoutsFolder, layout.name + ".json");
        const content = JSON.stringify(layout, undefined, 2);
        fs.writeFileSync(file, content, "utf8");
        res.status(201);
        res.send();
    }));

    router.delete("/layouts", asyncHandler(async (req, res, next) => {
        const user = getUser(req);
        const name = req.body.name;
        const type = req.body.type;
        console.log(`removing layout ${name} (${type}) for user ${user}`);
        // TODO - doing nothing as layouts are not saved per user in this example

        res.status(204);
        res.send();
    }));

    router.get("/default", asyncHandler(async (req, res, next) => {
        const user = getUser(req);
        let result: { name?: string } = {};
        if (fs.existsSync(defaultFilePath)) {
            const content = await readFile(defaultFilePath, { encoding: "utf-8" });
            result.name = content;
        }
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(result));
    }));

    router.post("/default", asyncHandler(async (req, res, next) => {
        const user = getUser(req);
        const layout = req.body.name;
        console.log(`saving default layout ${layout.name} for user ${user}`);

        fs.writeFileSync(defaultFilePath, layout, "utf8");
        res.status(201);
        res.send();
    }));

    async function fetchLayoutsConfigurations(user: string): Promise<any[]> {
        console.log(`${new Date().toLocaleTimeString()} fetching layouts for ${user}`);
        const files = await readDir(layoutsFolder);
        const filesContentsP =
            files
                .filter((f) => f.endsWith(".json"))
                .map(fn => {
                    return readFile(path.join(layoutsFolder, fn), "utf8").then(JSON.parse);
                });
        return await Promise.all(filesContentsP);
    }

    return router;
};
