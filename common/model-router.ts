import * as mongoose from 'mongoose'
import * as express from 'express'
import { Router } from './router';
import { environment } from './environment';
import { NotFoundError, BadRequest } from './error';
import * as joi from 'joi'

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    basePath: string
    pageSize: number

    constructor(protected model: mongoose.Model<D>) {
        super()
        this.basePath = `/${model.collection.name}`
        this.pageSize = <number>environment.server.pageSize
    }

    protected prepareOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D> {
        return query
    }

    protected prepareAll(query: mongoose.DocumentQuery<D[], D>): mongoose.DocumentQuery<D[], D> {
        return query
    }

    envelope(document: any): any {
        const resource = Object.assign({ _links: {} }, document.toJSON())
        resource._links.self = `${this.basePath}/${document._id}`
        return resource
    }

    envelopeAll(documents: any, options: any = {}): any {
        const resource: any = {
            _links: {
                self: options.url
            },
            items: documents
        }
        if (options.page && options.count && options.pageSize) {
            if (options.page > 1)
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`
            const remaing = options.count - (options.page * options.pageSize)
            if (remaing > 0)
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`
        }
        return resource
    }

    validateId: express.RequestHandler = (req: express.Request, resp: express.Response, next: express.NextFunction) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            next(new NotFoundError('Documento não encontrado'))
        next()
    }

    /**
     * Validar o schema passado e tratar os possivel erros
     * @param schema Schema de validação de entrada da rota
     */
    validateSchema(schema: joi.Schema): express.RequestHandler {
        return (req: express.Request, resp: express.Response, next: express.NextFunction) => {
            let body = req.body
            const result = schema.validate(body, { abortEarly: false })
            if (!result.error)
                next()
            else {
                let errors: string[] = []
                for (let m of result.error.details) {
                    errors.push(m.message)
                }
                let error = new BadRequest('Invalid Data')
                error.errors = errors
                next(error)
            }
        }
    }

    findAll: express.RequestHandler = (req: express.Request, resp: express.Response, next: express.NextFunction) => {
        let page = parseInt(req.query._page || 1)
        page = page > 0 ? page : 1
        let skip = this.pageSize * (page - 1)
        this.model
            .countDocuments()
            .then(count => this.prepareAll(this.model.find())
                .skip(skip)
                .limit(this.pageSize)
                .then(this.renderAll(resp, next, { page, count, pageSize: this.pageSize, url: req.url })))
            .catch(next)
    }

    findById: express.RequestHandler = (req: express.Request, resp: express.Response, next: express.NextFunction) => {
        this.prepareOne(this.model.findById(req.params.id))
            .then(this.render(resp, next))
            .catch(next)
    }

    save: express.RequestHandler = (req: express.Request, resp: express.Response, next: express.NextFunction) => {
        let model = new this.model(req.body)
        model.save()
            .then(this.render(resp, next))
            .catch(next)
    }

    replace: express.RequestHandler = (req: express.Request, resp: express.Response, next: express.NextFunction) => {
        const options: mongoose.QueryUpdateOptions = {
            runValidators: true,
            new: true,
            overwrite: true
        }
        this.model.findOneAndUpdate(req.params.id, req.body, options)
            .then(this.render(resp, next))
            .catch(next)
    }

    update: express.RequestHandler = (req: express.Request, resp: express.Response, next: express.NextFunction) => {
        const options: mongoose.QueryUpdateOptions = {
            runValidators: true,
            new: true,
        }
        this.model.findOneAndUpdate(req.params.id, req.body, options)
            .then(this.render(resp, next))
            .catch(next)
    }
}