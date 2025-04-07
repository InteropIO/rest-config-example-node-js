export interface Application {
    name: string;
    def: any;
    allowedTo: AllowTo[];
}

export interface AllowTo {
    key: string;
    value: string;
}