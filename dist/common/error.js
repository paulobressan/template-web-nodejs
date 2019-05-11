"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ForbiddenError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.errors = [];
    }
}
exports.NotFoundError = NotFoundError;
class BadRequest extends Error {
    constructor(message) {
        super(message);
        this.errors = [];
    }
}
exports.BadRequest = BadRequest;
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.errors = [];
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=error.js.map