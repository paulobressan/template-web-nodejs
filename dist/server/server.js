"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const error_handler_1 = require("./error.handler");
const logger_1 = require("../common/logger");
const expressPinoLogger = require("express-pino-logger");
const cors = require("cors");
const bodyParser = require("body-parser");
const token_parser_1 = require("../src/security/token.parser");
class Server {
    initDb() {
        mongoose.Promise = global.Promise;
        const options = {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false
        };
        return mongoose.connect(environment_1.environment.db.url, options);
    }
    initRoutes(routes) {
        return new Promise((resolve, reject) => {
            try {
                this.application = express();
                this.application.use(expressPinoLogger({ logger: logger_1.logger }));
                this.application.use(cors());
                this.application.use(bodyParser.urlencoded({ extended: true }));
                this.application.use(bodyParser.json());
                this.application.use(token_parser_1.tokenParser);
                for (let route of routes) {
                    route.apply(this.application);
                }
                this.application.use(error_handler_1.handlerError);
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    bootstrap(routes = []) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initDb();
            yield this.initRoutes(routes);
            return this;
        });
    }
    shutDown() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose.disconnect();
            return process.exit();
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map