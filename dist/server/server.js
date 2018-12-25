"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const error_handler_1 = require("./error.handler");
const merge_patch_parser_1 = require("./merge-patch.parser");
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
                const options = {
                    name: 'erp-food-web',
                    version: '1.0.0'
                };
                this.application = restify.createServer(options);
                this.application.use(restify.plugins.bodyParser());
                this.application.use(restify.plugins.queryParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                for (let route of routes) {
                    route.apply(this.application);
                }
                this.application.on('restifyError', error_handler_1.handlerError);
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
        return this.initDb()
            .then(() => this.initRoutes(routes))
            .then(() => this);
    }
    shutDown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map