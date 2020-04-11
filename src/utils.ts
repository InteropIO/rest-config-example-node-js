import { Request as ExpressRequest } from "express";

export function getUser(req: ExpressRequest): string {
    return req.header("impersonated_user") || req.header("user") || "<unknown>";
}