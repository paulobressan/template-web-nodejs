export class ForbiddenError extends Error {
    constructor(message) {
        super(message)
    }
}

export class NotFoundError extends Error {
    constructor(message) {
        super(message)
    }
    errors = []
}

export class BadRequest extends Error {
    constructor(message) {
        super(message)
    }
    errors = []
}

export class UnauthorizedError extends Error {
    constructor(message) {
        super(message)
    }
    errors = []
}