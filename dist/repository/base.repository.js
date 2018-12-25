"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const restify_errors_1 = require("restify-errors");
class BaseRepository {
    constructor(model) {
        this.model = model;
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
    validateId(id) {
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new restify_errors_1.NotFoundError('Documento não encontrado');
        return true;
    }
    findAll(pageSize, skip) {
        return this.model
            .countDocuments()
            .then(count => this.prepareAll(this.model.find())
            .skip(skip)
            .limit(this.pageSize));
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map