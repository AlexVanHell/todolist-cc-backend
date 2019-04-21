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
require("reflect-metadata");
require("@tsed/swagger");
const Path = require("path");
const dotenv = require("dotenv");
const logger = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
dotenv.config({ path: '.env' });
const common_1 = require("@tsed/common");
const ts_log_debug_1 = require("ts-log-debug");
const mongoose_service_1 = require("./services/shared/mongoose.service");
const rootDir = Path.resolve(__dirname);
let Server = class Server extends common_1.ServerLoader {
    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    $onMountingMiddlewares() {
        return __awaiter(this, void 0, void 0, function* () {
            this
                .use(common_1.GlobalAcceptMimesMiddleware)
                .use(bodyParser())
                .use(compression())
                .use(express())
                .use(logger('dev'))
                .use(cors())
                .use(bodyParser.json())
                .use(bodyParser.urlencoded({
                extended: true
            }));
            return undefined;
        });
    }
    $onInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose_service_1.MongooseService.connect();
            ts_log_debug_1.$log.debug('DB connected');
        });
    }
    $onReady() {
        ts_log_debug_1.$log.info('Server started...');
    }
    $onServerInitError(err) {
        ts_log_debug_1.$log.error(err);
    }
};
Server = __decorate([
    common_1.ServerSettings({
        rootDir,
        mount: {
            '/api/v1': `${rootDir}/controllers/**/**.controller.{ts,js}`
        },
        componentsScan: [
            `${rootDir}/services/**/**.service.{ts,js}`,
            `${rootDir}/middlewares/**/**.{ts,js}`,
            `${rootDir}/models/dal/**/**.{ts,js}`
        ],
        httpPort: process.env.PORT || 3000,
        httpsPort: false,
        acceptMimes: ['application/json'],
        swagger: {
            path: '/api-docs'
        }
    })
], Server);
exports.Server = Server;
//# sourceMappingURL=app.js.map