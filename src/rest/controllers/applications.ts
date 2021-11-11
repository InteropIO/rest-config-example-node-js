import { Express, Router } from "express";
import asyncHandler from "express-async-handler";
import { getUser } from "../../utils";
import { ApplicationsStore } from "../../stores/store";
import { Application } from "../../types/application";
import { deleteResult, postResult } from "../utils/results";

export default (store: ApplicationsStore): Router => {
    const router: Router = Router();

    router.get("/", asyncHandler(async (req, res, next) => {
        const user = getUser(req);
        const all = await store.getAll();
        const filtered = filterApps(all, user);
        const definitions = filtered.map(a => a.def);
        let applications = definitions;
        if (process.env.USE_FDC3) {
            applications = definitions.map(toFDC3);
        }
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ applications }));
    }));

    router.post("/", asyncHandler(async (req, res, next) => {
        // TODO check for valid def
        const def = req.body;
        if (!def || !def.name) {
            throw new Error("missing name in definition");
        }

        store.add(def);
        postResult(res, {}, "/apps");
    }));

    router.delete("/:id", asyncHandler(async (req, res, next) => {
        if (!req.params.id) {
            throw new Error("id is missing");
        }

        await store.remove(req.params.id);
        deleteResult(res);
    }));

    return router;
}

const toFDC3 = (config: any): FDC3AppDefinition => {
    return {
        name: config.name,
        version: "1",
        title: config.title,
        manifestType: "Glue42",
        manifest: JSON.stringify(config)
    }
}

const filterApps = (apps: Application[], user: string): Application[] => {
    return apps;
}


interface FDC3AppDefinition {
    name: string;
    version: "1";
    title: string;
    manifestType: "Glue42",
    manifest: string;
}