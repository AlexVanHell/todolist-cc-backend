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
const swagger_1 = require("@tsed/swagger");
const typescript_param_validator_1 = require("typescript-param-validator");
const auth_service_1 = require("../../services/auth/auth.service");
const auth_dto_1 = require("../../models/dto/auth.dto");
const helpers_service_1 = require("../../utils/helpers.service");
const error_1 = require("../../utils/error");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.authenticateLocal(body.email, body.password);
        });
    }
    signup(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authService.createUser(body);
            const authData = yield this.authService.authenticateLocal(user.email, body.password);
            return authData;
        });
    }
    getUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.getUserById(req.user._id);
        });
    }
    findUserName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authService.getUserByUsername(name, 'username');
            return { username: user ? user.username : undefined };
        });
    }
    findEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!helpers_service_1.validateEmail(email)) {
                throw new error_1.ApiError({ message: 'Invalid email' }, 400 /* BAD_REQUEST */);
            }
            const user = yield this.authService.getUserByEmail(email, 'email');
            return { email: user ? user.email : undefined };
        });
    }
};
__decorate([
    common_1.Post('/login'),
    swagger_1.Returns(auth_dto_1.AuthDto),
    typescript_param_validator_1.Validate(),
    __param(0, typescript_param_validator_1.Validator()), __param(0, common_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    common_1.Post('/signup'),
    swagger_1.Returns(auth_dto_1.AuthDto),
    common_1.Status(201),
    typescript_param_validator_1.Validate(),
    __param(0, typescript_param_validator_1.Validator()), __param(0, common_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.SignupDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    common_1.Get('/user'),
    swagger_1.Description('Get information about authenticated user'),
    swagger_1.Returns(auth_dto_1.UserDto),
    common_1.Authenticated(),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUser", null);
__decorate([
    common_1.Get('/user/username'),
    swagger_1.Description('Check if username is already in use'),
    swagger_1.Returns(auth_dto_1.UsernameDto),
    __param(0, common_1.QueryParams('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findUserName", null);
__decorate([
    common_1.Get('/user/email'),
    swagger_1.Description('Check if email is already in use'),
    swagger_1.Returns(auth_dto_1.EmailDto),
    __param(0, common_1.QueryParams('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findEmail", null);
AuthController = __decorate([
    common_1.Controller('/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map