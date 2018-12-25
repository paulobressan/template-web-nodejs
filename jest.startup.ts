import * as jestCli from 'jest-cli'
import { Server } from "./server/server"
import { environment } from "./common/environment"
import { usersRouter } from "./users/users.router"
import { User } from "./users/users.model"

let server: Server

const beforeAllTests = () => {
    environment.db.url = process.env.DB_TEST_URL || 'mongodb://localhost/erp-food-web-test'
    environment.server.port = process.env.SERVER_PORT_TEST || 4001

    server = new Server()

    return server.bootstrap([
        usersRouter
    ])
        .then(server => User.deleteMany({}))
        .catch(console.error)
}

const afterAllTests = () => {
    return server.shutDown()
}

beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error)