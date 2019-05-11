"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const error_1 = require("./error");
class Router extends events_1.EventEmitter {
    envelope(document) {
        return document;
    }
    envelopeAll(documents, options = {}) {
        return documents;
    }
    render(resp, next) {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document);
                resp.json(this.envelope(document));
            }
            else
                throw new error_1.NotFoundError("Documento não encontrado");
            return next(false);
        };
    }
    renderAll(resp, next, options = {}) {
        return (documents) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    array[index] = this.envelope(document);
                });
                resp.json(this.envelopeAll(documents, options));
            }
            else
                resp.json(this.envelopeAll([], options));
            next();
        };
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map