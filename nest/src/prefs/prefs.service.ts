import { Injectable } from '@nestjs/common';
import { promisify } from "util";
import { readdir, readFile, writeFile, unlink, mkdir, access } from "fs";
import { join } from "path";
import * as json5 from "json5";

const readDirPromisfied = promisify(readdir);
const readFilePromisified = promisify(readFile);
const writeFilePromisified = promisify(writeFile);
const unlinkFilePromisified = promisify(unlink);
const accessPromisified = promisify(access);
const mkDirPromisified = promisify(mkdir);

/**
 * Service for managing application preferences by reading from and writing to the file system.
 * Preferences for each application are stored in separate files.
 * Note: This implementation is simplified and does not handle user-specific preferences or permissions.
 */

@Injectable()
export class FileBasedPrefsService {
  private folder = process.env.PREFS_FOLDER || "./configuration/prefs";

  constructor() {
    mkDirPromisified(this.folder, { recursive: true });
  }

  public async getMany(apps: string[]): Promise<any[]> {
    const results = [];
    for (const app of apps) {
      const result = await this.get(app);
      results.push(result);
    }
    return results;
  }

  public async get(app: string): Promise<any | undefined> {
    const file = this.fullPath(app);
    try {
      await accessPromisified(file);
      const c = await readFilePromisified(file, "utf8")
      return json5.parse(c);
    } catch {
      return undefined;
    }
  }

  public async getAll(): Promise<any[]> {
    const result = [];
    let files = await readDirPromisfied(this.folder);
    files = files.filter(f => f.endsWith(".json"));
    for (const file of files) {
      const fullFilePath = join(this.folder, file);
      const c = await readFilePromisified(fullFilePath, "utf8")
      result.push(json5.parse(c));
    }
    return result;
  }

  public add(app: string, data: any): Promise<void> {
    const file = this.fullPath(app);
    const content = JSON.stringify(data, undefined, 2);
    return writeFilePromisified(file, content, "utf8");
  }

  public remove(app: string): Promise<void> {
    const file = this.fullPath(app);
    return unlinkFilePromisified(file);
  }

  public async clear(): Promise<void> {
    let files = await readDirPromisfied(this.folder);
    files = files.filter(f => f.endsWith(".json"));
    files.map((f) => {
      unlinkFilePromisified(join(this.folder, f));
    });
  }

  private fullPath(app: string) {
    const fileName = `${app}.json`;
    return join(this.folder, fileName);
  }
}