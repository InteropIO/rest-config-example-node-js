import { Injectable } from '@nestjs/common';
import { promisify } from "util";
import { readdir, readFile, mkdir, existsSync } from "fs";
import * as json5 from "json5";
import { join } from "path";

const readDirPromisfied = promisify(readdir);
const readFilePromisified = promisify(readFile);
const mkDirPromisified = promisify(mkdir);

@Injectable()
export class FileBasedConfigService {
  private folder = process.env.PREFS_FOLDER || "./configuration/configs";
  // some of the confis are actually arrays (not objects)
  private arrayConfigs = ["themes.json", "channels.json"];

  constructor() {
    mkDirPromisified(this.folder, { recursive: true });
  }

  public async get(configsR: string): Promise<Record<string, any>> {
    let configs: string[] = [];
    if (configsR === "*") {
      configs = await this.getAvailableConfigFiles();
    } else {
      configs = configsR.split(",");
    }

    const result: Record<string, any> = {};
    if (configs) {
      for (const config of configs) {
        let contents;
        try {
          contents = await this.fetchConfiguration(config);
        } catch (e) {
          // TODO log
          console.error("Error reading config file", e);
        }
        result[config] = { contents };
      }
    }
    return result;
  }

  private async fetchConfiguration(configName: string) {
    const isArrayResult = this.arrayConfigs.includes(configName);
    const result = await this.readConfigFile(configName, isArrayResult);
    return result;
  }

  private async readConfigFile(configName: string, arrayResult = false) {
    let defaultResult: any = {};
    if (arrayResult) {
      defaultResult = [];
    }
    try {
      const filePath = join(this.folder, configName);
      if (!existsSync(filePath)) {
        return defaultResult;
      }
      return readFilePromisified(join(filePath), "utf8");
    } catch {
      return defaultResult;
    }
  }

  private async getAvailableConfigFiles() {
    let names: string[] = [];
    try {
      names = await readDirPromisfied(this.folder);
      names = names
        .filter(n => n.endsWith(".json") && !n.includes("-"))
    } catch (e) {
      // TODO log
    }

    if (names === undefined) {
      names = [];
    }
    return names;
  }
}