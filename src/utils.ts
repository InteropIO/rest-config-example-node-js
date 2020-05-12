import { Request as ExpressRequest } from "express";

export function getUser(req: ExpressRequest): string {
    return req.header("impersonated_user") || req.header("user") || "<unknown>";
}
export function getRegionEnvFolder(req: ExpressRequest, filePath: string): string {
    return filePath.replace("%ENV%", req.header("env") as string).replace("%REGION%", req.header("region") as string);
}