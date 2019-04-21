"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var MongooseService_1;
const mongoose = require("mongoose");
const di_1 = require("@tsed/di");
mongoose.Promise = global.Promise;
let MongooseService = MongooseService_1 = class MongooseService {
    static connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const mongoUrl = process.env.MONGODB_URI;
            if (MongooseService_1.resource) {
                return MongooseService_1.resource;
            }
            const db = yield mongoose.connect(mongoUrl, {
                useMongoClient: true
            });
            MongooseService_1.resource = db;
            return db;
        });
    }
};
MongooseService = MongooseService_1 = __decorate([
    di_1.Service()
], MongooseService);
exports.MongooseService = MongooseService;
//# sourceMappingURL=mongoose.service.js.map