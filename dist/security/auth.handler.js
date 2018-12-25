"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = require("../users/users.model");
const restify_errors_1 = require("restify-errors");
const jwt = require("jsonwebtoken");
const environment_1 = require("../common/environment");
exports.authenticate = (req, resp, next) => {
    const { login, email, password } = req.body;
    users_model_1.User.findByEmailOrLogin(login, email, '+password')
        .then(user => {
        if (user && user.matchesPassword(password)) {
            const token = jwt.sign({ sub: user.email, iss: 'erp-food-web' }, environment_1.environment.secutiry.jwtSecret);
            resp.json({
                name: user.name,
                email: user.email,
                accessToken: token
            });
            return next(false);
        }
        else
            return next(new restify_errors_1.NotAuthorizedError('Usuário ou senha incorreto'));
    })
        .catch(next);
};
//# sourceMappingURL=auth.handler.js.map