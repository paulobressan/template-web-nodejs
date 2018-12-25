import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { Router } from '../common/router';
import { environment } from '../common/environment';
import { handlerError } from './error.handler';
import { mergePatchBodyParser } from './merge-patch.parser';

export class Server {
    application: restify.Server

    initDb(): Promise<any> {
        (<any>mongoose).Promise = global.Promise;
        const options: mongoose.ConnectionOptions = {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false
        }
        return mongoose.connect(environment.db.url, options)
    }

    initRoutes(routes: Router[]): Promise<restify.Server> {
        return new Promise((resolve, reject) => {
            try {
                const options: restify.ServerOptions = {
                    name: 'erp-food-web',
                    version: '1.0.0'
                }

                this.application = restify.createServer(options)
                this.application.use(restify.plugins.bodyParser())
                this.application.use(restify.plugins.queryParser())
                this.application.use(mergePatchBodyParser)

                for (let route of routes) {
                    route.apply(this.application)
                }

                this.application.on('restifyError', handlerError)

                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    bootstrap(routes: Router[] = []): Promise<Server> {
        return this.initDb()
            .then(() => this.initRoutes(routes))
            .then(() => this)
    }

    shutDown(): Promise<any> {
        return mongoose.disconnect().then(() => this.application.close())
    }
}