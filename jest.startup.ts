import * as jestCli from 'jest-cli'
import { Server } from "./server/server"
import { environment } from "./common/environment"
import { usersRouter } from "./src/users/users.router"
import { User } from "./src/users/users.model"

let server: Server

const beforeAllTests = () => {
    environment.db.url = process.env.DB_TEST_URL || 'mongodb://localhost/erp-food-web-test'
    environment.server.port = process.env.SERVER_PORT_TEST || 4001
    environment.secutiry.jwtSecret = 'test-secret-erp-food-web'
    server = new Server()

    return server.bootstrap([
        usersRouter
    ])
        .then(server => User.deleteMany({}))
        .then(() => {
            let admin = new User();
            admin.name = 'Admin';
            admin.login = 'admintest'
            admin.email = 'admin@email.com';
            admin.password = '12345678';
            admin.profiles = ['admin', 'user'];
            return admin.save();
        })
        .catch(console.error)
}

const afterAllTests = () => {
    return server.shutDown()
}

beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(err => {
        console.error
        process.exit(1)
    })