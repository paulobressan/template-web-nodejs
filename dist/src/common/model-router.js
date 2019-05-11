"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const restify_errors_1 = require("restify-errors");
const router_1 = require("./router");
const environment_1 = require("./environment");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        this.validateId = (req, resp, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.id))
                next(new restify_errors_1.NotFoundError('Documento não encontrado'));
            next();
        };
        this.findAll = (req, resp, next) => {
            let page = parseInt(req.query._page || 1);
            page = page > 0 ? page : 1;
            let skip = this.pageSize * (page - 1);
            this.model
                .countDocuments()
                .then(count => this.prepareAll(this.model.find())
                .skip(skip)
                .limit(this.pageSize)
                .then(this.renderAll(resp, next, { page, count, pageSize: this.pageSize, url: req.url })))
                .catch(next);
        };
        this.findById = (req, resp, next) => {
            this.prepareOne(this.model.findById(req.params.id))
                .then(this.render(resp, next))
                .catch(next);
        };
        this.save = (req, resp, next) => {
            let model = new this.model(req.body);
            model.save()
                .then(this.render(resp, next))
                .catch(next);
        };
        this.replace = (req, resp, next) => {
            const options = {
                runValidators: true,
                new: true,
                overwrite: true
            };
            this.model.findOneAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        };
        this.update = (req, resp, next) => {
            const options = {
                runValidators: true,
                new: true,
            };
            this.model.findOneAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        };
        this.basePath = `/${model.collection.name}`;
        this.pageSize = environment_1.environment.server.pageSize;
    }
    prepareOne(query) {
        return query;
    }
    prepareAll(query) {
        return query;
    }
    envelope(document) {
        const resource = Object.assign({ _links: {} }, document.toJSON());
        resource._links.self = `${this.basePath}/${document._id}`;
        return resource;
    }
    envelopeAll(documents, options = {}) {
        const resource = {
            _links: {
                self: options.url
            },
            items: documents
        };
        if (options.page && options.count && options.pageSize) {
            if (options.page > 1)
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`;
            const remaing = options.count - (options.page * options.pageSize);
            if (remaing > 0)
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`;
        }
        return resource;
    }
}
exports.ModelRouter = ModelRouter;
//# sourceMappingURL=model-router.js.map