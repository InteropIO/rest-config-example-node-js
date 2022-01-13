import { Application } from "../types/application";

export interface Store {
    applications: ApplicationsStore;
    prefs: PrefsStore;
    // layouts: LayoutsStore;
}

export interface ApplicationsStore {
    getAll(): Promise<Application[]>;
    remove(name: string): Promise<void>;
    add(def: Application): Promise<Application>;
    update(def: Application): Promise<Application>;
}

export interface LayoutsStore {
    getAll(): Promise<any[]>;
}

export interface PrefsStore {
    get(user: string, app: string): Promise<any>;
    getMany(user: string, apps: string[]): Promise<any[]>;
    getAll(user: string): Promise<any[]>;
    add(user: string, app: string, data: any): Promise<void>;
    remove(user: string, app: string): Promise<void>;
    clear(user: string): Promise<void>;
}