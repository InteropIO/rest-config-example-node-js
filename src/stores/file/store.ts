import { ApplicationsStore, Store } from "../store";
import { FileBasedApplicationsStore } from "./applications";

export class FileBasedStore implements Store {
    public applications: ApplicationsStore;

    constructor() {
        const appsFolder = process.env.APPS_FOLDER || "./configuration/apps";
        this.applications = new FileBasedApplicationsStore(appsFolder);
    }
}