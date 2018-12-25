"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jestCli = require("jest-cli");
const server_1 = require("./server/server");
const environment_1 = require("./common/environment");
const users_router_1 = require("./users/users.router");
const users_model_1 = require("./users/users.model");
let server;
const beforeAllTests = () => {
    environment_1.environment.db.url = process.env.DB_TEST_URL || 'mongodb://localhost/erp-food-web-test';
    environment_1.environment.server.port = process.env.SERVER_PORT_TEST || 4001;
    server = new server_1.Server();
    return server.bootstrap([
        users_router_1.usersRouter
    ])
        .then(server => users_model_1.User.deleteMany({}))
        .catch(console.error);
};
const afterAllTests = () => {
    return server.shutDown();
};
beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error);
//# sourceMappingURL=jest.startup.js.map