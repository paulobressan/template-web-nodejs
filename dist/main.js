"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const root_router_1 = require("./root/root.router");
const server = new server_1.Server();
server.bootstrap([
    users_router_1.usersRouter,
    root_router_1.rootRouter
])
    .then(server => console.log('Server is runner', server.application.address()))
    .catch(err => console.log('Error in Server', err));
//# sourceMappingURL=main.js.map