import { Application } from "../types/application";

export interface Store {
    applications: ApplicationsStore;
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