import * as express from 'express'
import { ForbiddenError } from '../../common/error';

export const authorize: (...profiles: string[]) => express.RequestHandler = (...profiles) => {
    return (req: express.Request, resp: express.Response, next: express.NextFunction) => {
        if ((<any>req).authenticated !== undefined && (<any>req).authenticated.hasAnyProfile(...profiles)) {
            next()
        } else {
            next(new ForbiddenError("Permission denied"))
        }
    }
}