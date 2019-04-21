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
const bcrypt = require("bcrypt-nodejs");
const typegoose_1 = require("typegoose");
const token_constants_1 = require("./token-constants");
let User = class User extends typegoose_1.Typegoose {
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    matchPassword(candidatePassword) {
        return new Promise((resolve) => {
            bcrypt.compare(String(candidatePassword), this.password, (err, isMatch) => {
                if (err || !isMatch)
                    return resolve(false);
                resolve(true);
            });
        });
    }
};
__decorate([
    typegoose_1.prop({ unique: true }),
    common_1.JsonProperty(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typegoose_1.prop(),
    common_1.JsonProperty(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typegoose_1.prop(),
    common_1.JsonProperty(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    typegoose_1.prop(),
    common_1.JsonProperty(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    typegoose_1.prop({ unique: true }),
    common_1.JsonProperty(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typegoose_1.prop(),
    common_1.JsonProperty(),
    __metadata("design:type", String)
], User.prototype, "secondLastName", void 0);
__decorate([
    typegoose_1.prop(),
    common_1.JsonProperty(),
    __metadata("design:type", String)
], User.prototype, "picture", void 0);
__decorate([
    typegoose_1.prop(),
    common_1.JsonProperty(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], User.prototype, "fullName", null);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], User.prototype, "matchPassword", null);
User = __decorate([
    typegoose_1.pre('save', preSaveHook)
], User);
exports.User = User;
function preSaveHook(next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified('password'))
            return next();
        bcrypt.genSalt(10, (err, salt) => {
            if (err)
                return next(err);
            bcrypt.hash(String(user.password), salt, undefined, (err, hash) => {
                if (err)
                    return next(err);
                user.password = hash;
                next();
            });
        });
    });
}
common_1.registerFactory(token_constants_1.UserRepositoryToken, new User().getModelForClass(User));
//# sourceMappingURL=User.js.map