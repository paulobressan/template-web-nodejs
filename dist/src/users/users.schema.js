"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
exports.UsersSchemaSave = joi.object().keys({
    name: joi.string().required().min(3).max(80),
    login: joi.string().required().min(8).max(40),
    email: joi.string().required().email(),
    password: joi.string().required().min(8),
});
//# sourceMappingURL=users.schema.js.map