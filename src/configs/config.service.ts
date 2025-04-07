import { Injectable } from '@nestjs/common';
import { promisify } from "util";
import { readdir, readFile, writeFile, unlink, mkdir, access, existsSync } from "fs";
import * as json5 from "json5";
import { join } from "path";

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
export class FileBasedConfigService {
  private folder = process.env.PREFS_FOLDER || "./configuration/configs";
  private arrayMergeUseSource = (_: any[], source: []) => source;
  // some of the confis are actually arrays (not objects)
  private arrayConfigs = ["themes", "channels"];

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
        try {
          result[config] = await this.fetchConfiguration(config);
        } catch (e) {
          // TODO log
          result[config] = undefined;
        }
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
      const filePath = join(this.folder, `${configName}.json`);
      if (!existsSync(filePath)) {
        return defaultResult;
      }
      const contents = await readFilePromisified(join(filePath), "utf8");
      return json5.parse(contents);
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
        .map(f => f.replace(".json", ""));
    } catch (e) {
      // TODO log
    }

    if (names === undefined) {
      names = [];
    }
    return names;
  }
}