import { Injectable } from '@nestjs/common';
import { promisify } from "util";
import { readdir, readFile, writeFile, unlink } from "fs";
import { join } from "path";
import * as json5 from "json5";
import { ApplicationDto as ApplicationDto } from './dto/app.dto';

const readDirPromisfied = promisify(readdir);
const readFilePromisified = promisify(readFile);
const writeFilePromisified = promisify(writeFile);
const unlinkFilePromisified = promisify(unlink);

/**
 * This service reads and writes the applications configuration from the file system.
 * Each app goes to a separate file.
 */
@Injectable()
export class FileBasedAppsService {
  private appsFolder = process.env.APPS_FOLDER || "./configuration/apps";

  async getApps(): Promise<ApplicationDto[]> {  
    // get the json files
    let files = await readDirPromisfied(this.appsFolder);
    files = files.filter(f => f.endsWith(".json"));

    const fileContentsP = files.map(async fn => {
      const appConfigFile = join(this.appsFolder, fn);
      return readFilePromisified(appConfigFile, "utf8")
        .then(c => json5.parse(c));
    });

    const fileContents = await Promise.all(fileContentsP);
    // each file can have single app definition or array of definitions
    const configs = fileContents.reduce((acc: any[], cfg) => {
      return acc.concat(cfg);
    }, []);

    return configs;
  }

  async addApp(def: ApplicationDto): Promise<void> {
    const appConfigFile = join(this.appsFolder, `${def.name}.json`);
    await writeFilePromisified(appConfigFile, JSON.stringify(def, null, 2));
  }

  async removeApp(name: string): Promise<void> {
    const appConfigFile = join(this.appsFolder, `${name}.json`);
    await unlinkFilePromisified(appConfigFile);
  }
}
