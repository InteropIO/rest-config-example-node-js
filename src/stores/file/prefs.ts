import { ApplicationsStore, PrefsStore } from "../store";
import { Application, AllowTo } from "../../types/application";
import util from "util";
import fs from "fs";
import path from "path";
import json5 from "json5";

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unlinkFile = util.promisify(fs.unlink);

export class FileBasedPrefsStore implements PrefsStore {
    private separator = "--";

    constructor(private folder: string) {
        fs.promises.mkdir(folder, { recursive: true });
    }

    public async get(user: string, app: string): Promise<any | undefined> {
        const file = this.fullPath(user, app);
        try {
            await fs.promises.access(file);
            const c = await readFile(file, "utf8")
            return json5.parse(c);
        } catch {
            return undefined;
        }
    }

    public async getAll(user: string): Promise<any[]> {
        const result = [];
        let files = await readDir(this.folder);
        files = files.filter(f => f.endsWith(".json"));
        for (const file of files) {
            if (file.startsWith(`${user}${this.separator}`)) {
                const fullFilePath = path.join(this.folder, file);
                const c = await readFile(fullFilePath, "utf8")
                result.push(json5.parse(c));
            }
        }
        return result;
    }

    public add(user: string, app: string, data: any): Promise<void> {
        const file = this.fullPath(user, app);
        const content = JSON.stringify(data, undefined, 2);
        return writeFile(file, content, "utf8");
    }

    public remove(user: string, app: string): Promise<void> {
        const file = this.fullPath(user, app);
        return unlinkFile(file);
    }

    public async clear(user: string): Promise<void> {
        let files = await readDir(this.folder);
        files = files.filter(f => f.endsWith(".json"));
        files.forEach((f) => {
            if (f.startsWith(`${user}${this.separator}`)) {
                unlinkFile(path.join(this.folder, f));
            }
        });
    }

    private fullPath(user: string, app: string) {
        const fileName = this.filename(user, app);
        return path.join(this.folder, fileName);
    }

    private filename(user: string, app: string) {
        return `${user}${this.separator}${app}.json`;
    }
}