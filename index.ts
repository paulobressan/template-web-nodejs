import { Server } from "./server/server";
import { usersRouter } from "./src/users/users.router";
import { rootRouter } from "./src/root/root.router";
import { environment } from "./common/environment";

const server = new Server()

server.bootstrap([
    usersRouter,
    rootRouter
])
    .then(() => console.log('Server is runner', environment.server.port))
    .catch(err => console.log('Error in Server', err))