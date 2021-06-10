import { ApplicationsStore, PrefsStore, Store } from "../store";
import { FileBasedApplicationsStore } from "./applications";
import { FileBasedPrefsStore } from "./prefs";

export class FileBasedStore implements Store {
    public applications: ApplicationsStore;
    public prefs: PrefsStore;

    constructor() {
        const appsFolder = process.env.APPS_FOLDER || "./configuration/apps";
        const prefsFolder = process.env.PREFS_FOLDER || "./configuration/prefs";
        this.applications = new FileBasedApplicationsStore(appsFolder);
        this.prefs = new FileBasedPrefsStore(prefsFolder);
    }
}