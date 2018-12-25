import { Server } from "./server/server";
import { usersRouter } from "./users/users.router";
import { rootRouter } from "./root/root.router";

const server = new Server()
server.bootstrap([
    usersRouter,
    rootRouter
])
    .then(server => console.log('Server is runner', server.application.address()))
    .catch(err => console.log('Error in Server', err))