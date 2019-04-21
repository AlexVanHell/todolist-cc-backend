"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const typescript_param_validator_1 = require("typescript-param-validator");
const app_errors_1 = require("../types/app.errors");
const ts_log_debug_1 = require("ts-log-debug");
let ServerErrorMiddleware = class ServerErrorMiddleware {
    constructor() { }
    use(error, request, res, next) {
        // tslint:disable-next-line
        let { status, code, message } = error;
        ts_log_debug_1.$log.debug(message);
        const response = {
            message: message || 'Error occurred',
            code,
            status
        };
        if (error instanceof typescript_param_validator_1.ValidatorError) {
            response.code = app_errors_1.API_ERRORS.VALIDATION_ERROR.code;
            response.message = app_errors_1.API_ERRORS.VALIDATION_ERROR.message;
            const messages = error.validationErrors.map((i) => {
                const items = [];
                for (const key of Object.keys(i.constraints)) {
                    items.push(i.constraints[key]);
                }
                return items;
            });
            status = 400;
            response.status = 400;
            response.reasons = [].concat(...messages);
        }
        res.status(status || 500).json(response);
    }
};
__decorate([
    __param(0, common_1.Err()),
    __param(1, common_1.Request()),
    __param(2, common_1.Response()),
    __param(3, common_1.Next()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Function]),
    __metadata("design:returntype", void 0)
], ServerErrorMiddleware.prototype, "use", null);
ServerErrorMiddleware = __decorate([
    common_1.OverrideMiddleware(common_1.GlobalErrorHandlerMiddleware),
    __metadata("design:paramtypes", [])
], ServerErrorMiddleware);
exports.ServerErrorMiddleware = ServerErrorMiddleware;
//# sourceMappingURL=error.middleware.js.map