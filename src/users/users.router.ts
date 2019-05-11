import * as express from 'express'
import { ModelRouter } from '../../common/model-router';
import { User } from './users.model';
import { authenticate } from '../security/auth';
import { authorize } from '../security/auth.handler';
import { UsersSchemaSave } from './users.schema';

class UsersRouter extends ModelRouter<User> {
    constructor() {
        super(User)
        this.on('beforeRender', document => {
            document.password = undefined
        })
    }

    findByEmail: express.RequestHandler = (req: express.Request, resp: express.Response, next: express.NextFunction) => {
        if (req.query.email)
            User.findByEmail(req.query.email)
                .then(user => {
                    if (user)
                        return [user]
                    return []
                })
                .then(this.renderAll(resp, next, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
                .catch(next)
        else
            next()
    }

    apply(application: express.Application) {
        application.get(this.basePath, authorize('user'), this.findByEmail, this.findAll)
        application.get(`${this.basePath}/:id`, authorize('user'), this.validateId, this.findById)
        application.post(this.basePath, authorize('admin'), this.validateSchema(UsersSchemaSave), this.save)
        application.post(`${this.basePath}/authenticate`, authenticate)
        application.put(`${this.basePath}/:id`, authorize('admin'), this.validateId, this.replace)
        application.patch(`${this.basePath}/:id`, authorize('admin'), this.validateId, this.update)
    }
}

export const usersRouter = new UsersRouter()