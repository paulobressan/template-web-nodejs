import * as express from 'express'
import { Router } from '../../common/router';
import { RootModel } from './root.model';

class RootRouter extends Router {
    routes: RootModel[] = []
    constructor() {
        super()
        this.routes.push(
            { name: 'users', url: '/users' }
        )
    }

    apply(application: express.Application): void {
        application.get('/', (req: express.Request, resp: express.Response, next: express.NextFunction) => {
            resp.json(this.routes)
            next()
        })
    }
}

export const rootRouter = new RootRouter()