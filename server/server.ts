import * as express from 'express'
import * as mongoose from 'mongoose'
import { Router } from '../common/router';
import { environment } from '../common/environment';
import { handlerError } from './error.handler';
import { logger } from '../common/logger';
import * as expressPinoLogger from 'express-pino-logger'
import cors = require('cors');
import bodyParser = require('body-parser');
import { tokenParser } from '../src/security/token.parser';

export class Server {
	application: express.Application

	private initDb(): Promise<any> {
		(<any>mongoose).Promise = global.Promise;
		const options: mongoose.ConnectionOptions = {
			useCreateIndex: true,
			useNewUrlParser: true,
			useFindAndModify: false
		}
		return mongoose.connect(environment.db.url, options)
	}

	private initRoutes(routes: Router[]): Promise<express.Application> {
		return new Promise((resolve, reject) => {
			try {
				this.application = express()

				this.application.use(expressPinoLogger({ logger }))

				this.application.use(cors())

				this.application.use(bodyParser.urlencoded({ extended: true }))
				this.application.use(bodyParser.json())

				this.application.use(tokenParser)

				for (let route of routes) {
					route.apply(this.application)
				}

				this.application.use(handlerError)

				this.application.listen(environment.server.port, () => {
					resolve(this.application)
				})
			} catch (err) {
				reject(err)
			}
		})
	}

	async bootstrap(routes: Router[] = []): Promise<Server> {
		await this.initDb();
		await this.initRoutes(routes);
		return this;
	}

	async shutDown(): Promise<any> {
		await mongoose.disconnect();
		return process.exit()
	}
}
