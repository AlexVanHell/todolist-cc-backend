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
const di_1 = require("@tsed/di");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const constants_1 = require("../../constants");
const token_constants_1 = require("../../models/dal/token-constants");
const app_errors_1 = require("../../types/app.errors");
const mongo_1 = require("../../types/mongo");
const error_1 = require("../../utils/error");
const helpers_service_1 = require("../../utils/helpers.service");
let AuthService = class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.USER_TOKEN_FIELDS = '_id email username lastName secondLastName firstName fullName picture';
    }
    /**
     * Used to fetch user based on its id.
     *
     * There are multiple approaches with working with jwt,
     * You can skip the hydration process and use only the jwt token as the user data.
     * But if you need to invalidate user token dynamically a db/redis query should be made.
     *
     * @param {string} id
     * @param {string} tokenFields Override default selected fields
     * @returns {Promise<UserInstance>}
     */
    rehydrateUser(id, tokenFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(id, tokenFields || this.USER_TOKEN_FIELDS);
            if (!user)
                return;
            return user;
        });
    }
    /**
     * Get user by provided id
     * @param id
     * @param tokenFields
     */
    getUserById(id, tokenFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(id, tokenFields || this.USER_TOKEN_FIELDS);
            if (!user)
                return;
            return user;
        });
    }
    /**
     * Get user by provided id
     * @param id
     * @param tokenFields
     */
    getUserByEmail(email, tokenFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ email }, tokenFields || this.USER_TOKEN_FIELDS);
            if (!user)
                return;
            return user;
        });
    }
    /**
     * Get user by provided id
     * @param id
     * @param tokenFields
     */
    getUserByUsername(name, tokenFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ username: name }, tokenFields || this.USER_TOKEN_FIELDS);
            if (!user)
                return;
            return user;
        });
    }
    /**
     * Create new user in database
     * @param profile
     */
    createUser(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateProfile(profile);
            const user = new this.userRepository(Object.assign({}, profile));
            try {
                return yield user.save();
            }
            catch (e) {
                if (e.code === mongo_1.MongoErrorCode.DUPLICATE_KEY)
                    throw new error_1.ApiError(app_errors_1.API_ERRORS.USER_ALREADY_EXISTS);
                throw new error_1.ApiError(app_errors_1.API_ERRORS.GENERAL_ERROR);
            }
        });
    }
    /**
     * Validate profile information
     * @param profile
     */
    validateProfile(profile) {
        if (!profile.email)
            throw new error_1.ApiError({ message: 'Missing email field' }, 400 /* BAD_REQUEST */);
        if (!helpers_service_1.validateEmail(profile.email))
            throw new error_1.ApiError({ message: 'Invalid email adress' }, 400 /* BAD_REQUEST */);
        if (!profile.firstName)
            throw new error_1.ApiError({ message: 'Missing firstName field' }, 400 /* BAD_REQUEST */);
        if (!profile.password)
            throw new error_1.ApiError({ message: 'Missing password field' }, 400 /* BAD_REQUEST */);
        if (profile.password && profile.password.length < 6)
            throw new error_1.ApiError({ message: 'Password must be 6 char long' }, 400 /* BAD_REQUEST */);
    }
    /**
     * Validate token with jwt
     * @param token
     */
    validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = jwt.verify(token, process.env.SECRET);
                return yield this.rehydrateUser(payload['_id']);
            }
            catch (err) {
                if (err.name === 'TokenExpiredError')
                    throw new error_1.ApiError(app_errors_1.API_ERRORS.EXPIRED_TOKEN);
                throw new error_1.ApiError(app_errors_1.API_ERRORS.UNAUTHORIZED);
            }
        });
    }
    authenticateLocal(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ email }, this.USER_TOKEN_FIELDS + ' password');
            if (!user)
                throw new error_1.ApiError(app_errors_1.API_ERRORS.USER_NOT_FOUND);
            const isMatch = yield user.matchPassword(password);
            if (!isMatch)
                throw new error_1.ApiError(app_errors_1.API_ERRORS.USER_WRONG_CREDENTIALS);
            return yield this.generateToken(user);
        });
    }
    generateToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                _id: user._id,
                email: user.email,
                lastName: user.lastName,
                firstName: user.firstName,
                picture: user.picture
            };
            return {
                token: jwt.sign(payload, process.env.SECRET, { expiresIn: constants_1.TOKEN_EXP }),
                expires: moment().add(constants_1.TOKEN_EXP, 'ms').format('X')
            };
        });
    }
};
AuthService = __decorate([
    di_1.Service(),
    __param(0, di_1.Inject(token_constants_1.UserRepositoryToken)),
    __metadata("design:paramtypes", [Object])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map