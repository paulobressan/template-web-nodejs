"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("http-status");
const error_1 = require("../common/error");
exports.handlerError = (error, req, resp, next) => {
    let code = http_status_1.INTERNAL_SERVER_ERROR;
    let message = error.message || "Internal Error";
    if (error instanceof error_1.BadRequest) {
        code = http_status_1.BAD_REQUEST;
        message = errorMessage(error);
    }
    if (error instanceof error_1.NotFoundError) {
        code = http_status_1.NOT_FOUND;
        message = errorMessage(error);
    }
    if (error instanceof error_1.ForbiddenError) {
        code = http_status_1.FORBIDDEN;
        message = errorMessage(error);
    }
    if (error instanceof error_1.UnauthorizedError) {
        code = http_status_1.UNAUTHORIZED;
        message = errorMessage(error);
    }
    switch (error.name) {
        case 'MongoError':
            if (error.code === 11000)
                code = http_status_1.BAD_REQUEST;
            break;
        case 'ValidationError':
            code = http_status_1.BAD_REQUEST;
            const messages = [];
            for (let name in error.errors) {
                messages.push({ message: error.errors[name].message });
            }
            message = {
                message: 'Validation error while processing your request',
                errors: messages
            };
            break;
    }
    resp.status(code)
        .json({ code, message });
};
function errorMessage(error) {
    if (error.errors) {
        const messages = [];
        for (let message of error.errors) {
            messages.push({ message });
        }
        return messages.length > 0
            ? {
                message: error.message,
                errors: messages
            }
            : error.message;
    }
    return error.message;
}
//# sourceMappingURL=error.handler.js.map