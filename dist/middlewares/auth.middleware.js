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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const auth_service_1 = require("../services/auth/auth.service");
const app_errors_1 = require("../types/app.errors");
const error_1 = require("../utils/error");
let AuthMiddleware = class AuthMiddleware {
    constructor(authService) {
        this.authService = authService;
    }
    use(endpoint, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = this.extractHeaderFromRequest(request);
            if (!token)
                throw new error_1.ApiError(app_errors_1.API_ERRORS.UNAUTHORIZED);
            request.user = yield this.authService.validateToken(token);
        });
    }
    extractHeaderFromRequest(req) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
            return authHeader.split(' ')[1];
        }
    }
};
__decorate([
    __param(0, common_1.EndpointInfo()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_1.EndpointMetadata, Object]),
    __metadata("design:returntype", Promise)
], AuthMiddleware.prototype, "use", null);
AuthMiddleware = __decorate([
    common_1.OverrideMiddleware(common_1.AuthenticatedMiddleware),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthMiddleware);
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map