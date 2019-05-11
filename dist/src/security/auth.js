"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = require("../users/users.model");
const jwt = require("jsonwebtoken");
const environment_1 = require("../../common/environment");
const error_1 = require("../../common/error");
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
            return next(new error_1.UnauthorizedError('Usuário ou senha incorreto'));
    })
        .catch(next);
};
//# sourceMappingURL=auth.js.map