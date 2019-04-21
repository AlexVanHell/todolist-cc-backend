"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_ERRORS = {
    GENERAL_ERROR: {
        message: 'Unexpected error occurred',
        status: 500 /* INTERNAL_SERVER_ERROR */,
        code: 1000
    },
    UNAUTHORIZED: {
        message: 'Unauthorized',
        status: 401 /* UNAUTHORIZED */,
        code: 1001
    },
    EXPIRED_TOKEN: {
        message: 'Expired token provided',
        status: 401 /* UNAUTHORIZED */,
        code: 1002
    },
    VALIDATION_ERROR: {
        message: 'Data validation error occurred',
        status: 400 /* BAD_REQUEST */,
        code: 1003
    },
    // User Errors
    USER_ALREADY_EXISTS: {
        message: 'User already exists.',
        status: 409 /* CONFLICT */,
        code: 2000
    },
    USER_NOT_FOUND: {
        message: 'User not found.',
        status: 404 /* NOT_FOUND */,
        code: 2001
    },
    USER_WRONG_CREDENTIALS: {
        message: 'Wrong credentials provided',
        status: 401 /* UNAUTHORIZED */,
        code: 2002
    },
};
//# sourceMappingURL=app.errors.js.map