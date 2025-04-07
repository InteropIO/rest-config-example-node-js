import { Response } from 'express';

export function getResult(res: Response, data: Object, meta?: any) {
    res.json({
        data,
        meta
    })
} 

export function postResult(res: Response, data: Object, location: string){
    res.status(201);
    res.location(location);
    res.json(data);
}

export function deleteResult(res: Response){
    res.status(204);
    res.send();
}