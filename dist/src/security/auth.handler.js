"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../common/error");
exports.authorize = (...profiles) => {
    return (req, resp, next) => {
        if (req.authenticated !== undefined && req.authenticated.hasAnyProfile(...profiles)) {
            next();
        }
        else {
            next(new error_1.ForbiddenError("Permission denied"));
        }
    };
};
//# sourceMappingURL=auth.handler.js.map