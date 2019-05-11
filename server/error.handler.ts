import * as express from 'express'
import { INTERNAL_SERVER_ERROR, BAD_REQUEST, NOT_FOUND, FORBIDDEN, UNAUTHORIZED } from 'http-status'
import { BadRequest, NotFoundError, ForbiddenError, UnauthorizedError } from '../common/error';

export const handlerError = (error, req: express.Request, resp: express.Response, next: express.NextFunction) => {
    let code = INTERNAL_SERVER_ERROR;
    let message = error.message || "Internal Error";

    if (error instanceof BadRequest) {
        code = BAD_REQUEST
        message = errorMessage(error)
    }

    if (error instanceof NotFoundError) {
        code = NOT_FOUND
        message = errorMessage(error)
    }

    if (error instanceof ForbiddenError) {
        code = FORBIDDEN
        message = errorMessage(error)
    }

    if (error instanceof UnauthorizedError) {
        code = UNAUTHORIZED
        message = errorMessage(error)
    }

    switch (error.name) {
        case 'MongoError':
            if (error.code === 11000)
                code = BAD_REQUEST
            break
        case 'ValidationError':
            code = BAD_REQUEST
            const messages: any[] = [];
            for (let name in error.errors) {
                messages.push({ message: error.errors[name].message })
            }
            message = {
                message: 'Validation error while processing your request',
                errors: messages
            }
            break
    }

    resp.status(code)
        .json({ code, message })
}

function errorMessage(error) {
    if (error.errors) {
        const messages: any[] = [];
        for (let message of error.errors) {
            messages.push({ message })
        }
        return messages.length > 0
            ? {
                message: error.message,
                errors: messages
            }
            : error.message
    }
    return error.message
}