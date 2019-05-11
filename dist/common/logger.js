"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pino = require("pino");
const environment_1 = require("../common/environment");
exports.logger = pino({
    name: environment_1.environment.log.name,
    level: environment_1.environment.log.level
});
//# sourceMappingURL=logger.js.map