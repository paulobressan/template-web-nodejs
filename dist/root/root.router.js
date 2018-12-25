"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
class RootRouter extends router_1.Router {
    constructor() {
        super();
        this.routes = [];
        this.routes.push({ name: 'users', url: '/users' });
    }
    apply(application) {
        application.get('/', (req, resp, next) => {
            resp.json(this.routes);
            next();
        });
    }
}
exports.rootRouter = new RootRouter();
//# sourceMappingURL=root.router.js.map