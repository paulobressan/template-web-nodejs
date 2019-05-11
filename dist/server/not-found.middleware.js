"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../common/error");
/** Responder 404 para rotas não implementadas */
const notFoundMiddleware = (req, res, next) => {
    next(new error_1.NotFoundError(`${req.originalUrl} not found`));
};
exports.default = notFoundMiddleware;
//# sourceMappingURL=not-found.middleware.js.map