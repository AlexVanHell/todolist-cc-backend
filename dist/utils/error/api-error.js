"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_errors_1 = require("../../types/app.errors");
class ApiError extends Error {
    constructor(payload, status = 500) {
        super(payload.message);
        this.code = (payload.code || app_errors_1.API_ERRORS.GENERAL_ERROR.code);
        this.status = (payload.status || status);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=api-error.js.map