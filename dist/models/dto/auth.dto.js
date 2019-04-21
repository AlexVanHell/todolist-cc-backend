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
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const common_1 = require("@tsed/common");
const typegoose_1 = require("typegoose");
var AuthProviderEnum;
(function (AuthProviderEnum) {
    AuthProviderEnum["FACEBOOK"] = "facebook";
})(AuthProviderEnum = exports.AuthProviderEnum || (exports.AuthProviderEnum = {}));
class AuthToken {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], AuthToken.prototype, "accessToken", void 0);
__decorate([
    typegoose_1.prop({
        enum: AuthProviderEnum
    }),
    __metadata("design:type", String)
], AuthToken.prototype, "provider", void 0);
exports.AuthToken = AuthToken;
class AuthDto {
}
__decorate([
    common_1.JsonProperty(),
    __metadata("design:type", String)
], AuthDto.prototype, "token", void 0);
__decorate([
    common_1.JsonProperty(),
    __metadata("design:type", String)
], AuthDto.prototype, "expires", void 0);
exports.AuthDto = AuthDto;
class LoginDto {
}
__decorate([
    common_1.JsonProperty(),
    class_validator_1.IsEmail(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    common_1.JsonProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MinLength(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
exports.LoginDto = LoginDto;
class SignupDto {
}
__decorate([
    class_validator_1.IsEmail(),
    class_validator_1.IsNotEmpty(),
    common_1.JsonProperty(),
    __metadata("design:type", String)
], SignupDto.prototype, "email", void 0);
__decorate([
    common_1.JsonProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MinLength(6),
    __metadata("design:type", String)
], SignupDto.prototype, "password", void 0);
__decorate([
    common_1.JsonProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], SignupDto.prototype, "firstName", void 0);
__decorate([
    common_1.JsonProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], SignupDto.prototype, "lastName", void 0);
exports.SignupDto = SignupDto;
class UserDto {
}
__decorate([
    common_1.JsonProperty(),
    __metadata("design:type", String)
], UserDto.prototype, "_id", void 0);
__decorate([
    common_1.JsonProperty(),
    __metadata("design:type", String)
], UserDto.prototype, "email", void 0);
__decorate([
    common_1.JsonProperty(),
    __metadata("design:type", String)
], UserDto.prototype, "username", void 0);
__decorate([
    common_1.JsonProperty(),
    __metadata("design:type", String)
], UserDto.prototype, "firstName", void 0);
__decorate([
    common_1.JsonProperty(),
    __metadata("design:type", String)
], UserDto.prototype, "lastName", void 0);
__decorate([
    common_1.JsonProperty(),
    __metadata("design:type", String)
], UserDto.prototype, "secondLastName", void 0);
__decorate([
    common_1.JsonProperty(),
    __metadata("design:type", String)
], UserDto.prototype, "fullName", void 0);
__decorate([
    common_1.JsonProperty(),
    __metadata("design:type", String)
], UserDto.prototype, "picture", void 0);
exports.UserDto = UserDto;
class UsernameDto {
}
__decorate([
    common_1.JsonProperty(),
    __metadata("design:type", String)
], UsernameDto.prototype, "username", void 0);
exports.UsernameDto = UsernameDto;
class EmailDto {
}
__decorate([
    common_1.JsonProperty(),
    __metadata("design:type", String)
], EmailDto.prototype, "email", void 0);
exports.EmailDto = EmailDto;
//# sourceMappingURL=auth.dto.js.map