"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./src/users/users.router");
const root_router_1 = require("./src/root/root.router");
const environment_1 = require("./common/environment");
const server = new server_1.Server();
server.bootstrap([
    users_router_1.usersRouter,
    root_router_1.rootRouter
])
    .then(() => console.log('Server is runner', environment_1.environment.server.port))
    .catch(err => console.log('Error in Server', err));
//# sourceMappingURL=index.js.map