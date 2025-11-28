class AppError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(404, message);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(409, message);
    }
}


class ValidationError extends AppError {
    constructor(message = 'Validation Error') {
        super(422, message);
    }
}

class ServiceUnavailableError extends AppError {
    constructor(message = 'Service Unavailable') {
        super(503, message);
    }
}

module.exports = {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    ValidationError,
    ServiceUnavailableError,
};
