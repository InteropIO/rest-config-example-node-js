import { ApplicationsStore } from "../store";
import { Application, AllowTo } from "../../types/application";
import util from "util";
import fs from "fs";
import path from "path";
import json5 from "json5";

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unlinkFile = util.promisify(fs.unlink);

export class FileBasedApplicationsStore implements ApplicationsStore {
    private permissionsFolder: string;
    constructor(private appsFolder: string) {
        this.permissionsFolder = appsFolder + "/permissions";
    }

    public async getAll(): Promise<Application[]> {
        let files = await readDir(this.appsFolder);
        files = files.filter(f => f.endsWith(".json"));
        const fileContentsP = files.map(async fn => {
            const appConfigFile = path.join(this.appsFolder, fn);
            return readFile(appConfigFile, "utf8")
                .then(c => json5.parse(c));
        });

        const fileContents = await Promise.all(fileContentsP);
        // each file can have single app definition or array of definitions
        const configs = fileContents.reduce((acc: any[], cfg) => {
            return acc.concat(cfg);
        }, []);

        const result: Application[] = [];
        for (const def of configs) {
            // TODO read allowed to
            const allowedTo = await this.readPermissions(def.name);
            const name = def.name;
            result.push({
                name,
                def,
                allowedTo
            })
        }

        return result
    }

    public update(def: Application): Promise<Application> {
        return this.saveCore(def);
    }

    public remove(name: string): Promise<void> {
        const file = path.join(this.appsFolder, name + ".json");
        return unlinkFile(file);
    }

    public add(def: Application): Promise<Application> {
        return this.saveCore(def);
    }

    private async saveCore(app: Application): Promise<Application> {
        const file = path.join(this.appsFolder, app.name + ".json");
        const content = JSON.stringify(app, undefined, 2);
        await writeFile(file, content, "utf8");
        await this.savePermissions(app.name, app.allowedTo);
        return app;
    }
    private readPermissions(name: any): Promise<AllowTo[]> {
        return Promise.resolve([]);
    }

    private savePermissions(name: any, allowed: AllowTo[]) {
        // throw new Error("Method not implemented.");
    }
}