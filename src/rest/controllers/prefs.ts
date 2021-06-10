import { Router } from "express";
import asyncHandler from "express-async-handler";
import { getUser } from "../../utils";
import { PrefsStore } from "../../stores/store";

export default (store: PrefsStore): Router => {
    const router: Router = Router();

    router.get("/", asyncHandler(async (req, res, next) => {
        const user = getUser(req);
        const app = req.body.app;
        const result = await store.get(user, app) ?? {};
        res.json(result);
    }));

    router.get("/all", asyncHandler(async (req, res, next) => {
        const user = getUser(req);
        const result = await store.getAll(user);
        res.json(result);
    }));

    router.post("/", asyncHandler(async (req, res, next) => {
        const user = getUser(req);
        const app = req.body.app;
        const data = req.body.data;
        await store.add(user, app, data);
        res.json({});
    }));

    router.delete("/", asyncHandler(async (req, res, next) => {
        const user = getUser(req);
        const app = req.body.app;
        if (app) {
            await store.remove(user, app);
        } else {
            // if no app specified remove all app preferences for the user
            await store.clear(user);
        }
        res.status(200);
        res.end();
    }));

    return router;
};
