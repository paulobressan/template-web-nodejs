import * as express from 'express';
import { NotFoundError } from '../common/error';

/** Responder 404 para rotas não implementadas */
const notFoundMiddleware: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(new NotFoundError(`${req.originalUrl} not found`))
}

export default notFoundMiddleware