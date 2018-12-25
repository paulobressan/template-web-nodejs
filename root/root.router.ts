import * as restify from 'restify'
import { Router } from '../common/router';
import { RootModel } from './root.model';

class RootRouter extends Router {
    routes: RootModel[] = []
    constructor() {
        super()
        this.routes.push(
            { name: 'users', url: '/users' }
        )
    }

    apply(application: restify.Server): void {
        application.get('/', (req: restify.Request, resp: restify.Response, next: restify.Next) => {
            resp.json(this.routes)
            next()
        })
    }
}

export const rootRouter = new RootRouter()