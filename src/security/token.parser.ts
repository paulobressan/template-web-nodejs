import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import { User } from '../users/users.model'
import { environment } from '../../common/environment';

export const tokenParser: express.RequestHandler = (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    const token = extractToken(req)
    if (token) {
        jwt.verify(token, environment.secutiry.jwtSecret, applyBearer(req, next))
    } else {
        next()
    }
}

function extractToken(req: express.Request) {
    let token: string = undefined
    const authorization = req.header('authorization')
    if (authorization) {
        const parts: string[] = authorization.split(' ')
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1]
        }
        return token
    }
}

function applyBearer(req: express.Request, next: express.NextFunction): (error, decoded) => void {
    return (error, decoded) => {
        if (decoded) {
            User.findByEmail(decoded.sub).then(user => {
                if (user) {
                    (<any>req).authenticated = user
                }
                next()
            }).catch(next)
        } else {
            next()
        }
    }
}