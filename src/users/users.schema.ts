import * as joi from 'joi'

export const UsersSchemaSave: joi.Schema = joi.object().keys({
    name: joi.string().required().min(3).max(80),
    login: joi.string().required().min(8).max(40),
    email: joi.string().required().email(),
    password: joi.string().required().min(8),
})