import * as restify from 'restify'
import { ModelRouter } from '../common/model-router';
import { User } from './users.model';
import { authenticate } from '../security/auth.handler';

class UsersRouter extends ModelRouter<User> {
    constructor() {
        super(User)
        this.on('beforeRender', document => {
            document.password = undefined
        })
    }

    findByEmail: restify.RequestHandler = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
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

    apply(application: restify.Server) {
        application.get(this.basePath, this.findByEmail, this.findAll)
        application.get(`${this.basePath}/:id`, this.validateId, this.findById)
        application.post(this.basePath, this.save)
        application.post(`${this.basePath}/authenticate`, authenticate)
        application.put(`${this.basePath}/:id`, this.validateId, this.replace)
        application.patch(`${this.basePath}/:id`, this.validateId, this.update)
    }
}

export const usersRouter = new UsersRouter()