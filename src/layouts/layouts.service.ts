import { Injectable } from '@nestjs/common';
import { promisify } from "util";
import { readdir, readFile, writeFile, unlink, existsSync } from "fs";
import { join } from "path";
import * as json5 from "json5";
import { SaveLayoutRequestDto } from './dto/save-layout-request.dto';
import { LayoutDto } from './dto/layout.dto';

const readDirPromisfied = promisify(readdir);
const readFilePromisified = promisify(readFile);
const writeFilePromisified = promisify(writeFile);
const unlinkFilePromisified = promisify(unlink);


/**
 * This service reads and writes layouts configuration from/to the file system.
 * Each layout goes to a separate file.
 * This example is simplified and does not consider users or permissions.
 */
@Injectable()
export class FileBasedLayoutsService {


  private layoutsFolder = process.env.LAYOUTS_FOLDER || "./configuration/layouts";
  private defaultLayoutType = "default";

  async getAll(): Promise<LayoutDto[]> {
    // get the json files
    let files = await readDirPromisfied(this.layoutsFolder);
    files = files.filter(f => f.endsWith(".json"));
    // ignore the default layout
    files = files.filter(f => !f.startsWith(`${this.defaultLayoutType}-`));

    const fileContentsP = files.map(async fn => {
      const appConfigFile = join(this.layoutsFolder, fn);
      return readFilePromisified(appConfigFile, "utf8")
        .then(c => json5.parse(c));
    });

    const fileContents = await Promise.all(fileContentsP);
    return fileContents;
  }

  async saveLayout(layout: LayoutDto): Promise<void> {
    const content = JSON.stringify(layout, undefined, 2);
    await writeFilePromisified(this.getLayoutPath(layout), content, "utf8");
  }

  async remove(name: string, type: string): Promise<void> {
    console.log(`Removing layout ${name} (${type})`);
    await unlinkFilePromisified(this.getLayoutPath({ name, type }));
  }

  async removeMany(ids: string[]): Promise<void> {
    // id is in format `name (type)`
    const promises = ids.map(id => {
      let [name, type] = id.split(" (");
      type = type.slice(0, -1); // remove the closing parenthesis
      return this.remove(name, type);
    });
    await Promise.all(promises);
  }

  async saveDefaultLayout(layout: LayoutDto): Promise<void> {
    const defaultFilePath = this.getLayoutPath({ name: "layout", type: this.defaultLayoutType });
    const content = JSON.stringify(layout, undefined, 2);
    await writeFilePromisified(defaultFilePath, content, "utf8");
  }

  async getDefaultLayout(): Promise<LayoutDto | undefined> {
    const defaultFilePath = this.getLayoutPath({ name: "layout", type: this.defaultLayoutType });
    if (existsSync(defaultFilePath)) {
      const content = await readFilePromisified(defaultFilePath, { encoding: "utf-8" });
      return JSON.parse(content);
    }
  }

  async renameLayout(layout: LayoutDto, newName: string): Promise<void> {
    try {
      const oldPath = this.getLayoutPath(layout);
      await unlinkFilePromisified(oldPath);
    } catch (error) {
      console.error("Error deleting old layout file:", error);
    }

    layout.name = newName;
    await this.saveLayout(layout);
  }

  getLayoutPath(layout: LayoutDto): string {
    return join(this.layoutsFolder, this.getLayoutName(layout));
  }

  getLayoutName(layout: LayoutDto): string {
    return `${layout.type}-${layout.name}.json`;
  }
}
