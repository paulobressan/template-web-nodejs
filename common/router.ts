import * as express from 'express'
import { EventEmitter } from 'events'
import { NotFoundError } from './error';

export abstract class Router extends EventEmitter {
    abstract apply(application: express.Application): void

    envelope(document: any) {
        return document;
    }

    envelopeAll(documents: any[], options: any = {}) {
        return documents;
    }

    render(resp: express.Response, next: express.NextFunction) {
        return (document: any) => {
            if (document) {
                this.emit('beforeRender', document)
                resp.json(this.envelope(document))
            }
            else
                throw new NotFoundError("Documento não encontrado")
            return next(false)
        }
    }

    renderAll(resp: express.Response, next: express.NextFunction, options: any = {}) {
        return (documents: any[]) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    array[index] = this.envelope(document)
                })
                resp.json(this.envelopeAll(documents, options))
            }
            else
                resp.json(this.envelopeAll([], options))
            next()
        }
    }
}
