import * as restify from 'restify'
import { User } from '../users/users.model';
import { NotAuthorizedError } from 'restify-errors'
import * as jwt from 'jsonwebtoken'
import { environment } from '../common/environment';

export const authenticate: restify.RequestHandler = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    const { login, email, password } = req.body
    User.findByEmailOrLogin(login, email, '+password')
        .then(user => {
            if (user && user.matchesPassword(password)) {
                const token = jwt.sign({ sub: user.email, iss: 'erp-food-web' }, environment.secutiry.jwtSecret)
                resp.json({
                    name: user.name,
                    email: user.email,
                    accessToken: token
                })
                return next(false)
            } else
                return next(new NotAuthorizedError('Usuário ou senha incorreto'))

        })
        .catch(next)
}