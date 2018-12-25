import * as restify from 'restify'
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import { environment } from '../common/environment';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nome obrigatório'],
        maxlength: 80,
        minlength: 3
    },
    login: {
        type: String,
        required: true,
        unique: true,
        maxlength: 40,
        minlength: 8
    },
    email: {
        type: String,
        required: String,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Senha obrigatória'],
        select: false,
        minlength: 8
    },
    isAtivo: {
        type: Boolean,
        required: false,
        default: true
    },
    profiles: {
        type: [String],
        default: ['user']
    },
    dateUpdate: {
        type: Date,
        required: false,
        default: new Date()
    },
    dateCreate: {
        type: Date,
        required: false,
        default: new Date()
    }
})

export interface User extends mongoose.Document {
    name: string,
    login: string,
    email: string,
    password: string,
    isAtivo: boolean,
    dateUpdate: Date,
    dateCreate: Date,
    hasAnyProfile(...profiles: string[]): boolean,
    matchesPassword(password: string): boolean
}

userSchema.methods.hasAnyProfile = function (...profiles: string[]): boolean {
    return profiles.some(profile => this.profiles.indexOf(profile) !== -1)
}

userSchema.methods.matchesPassword = function (password: string): boolean {
    return bcrypt.compareSync(password, this.password)
}

export interface UserModel extends mongoose.Model<User> {
    findByEmail(email: string, projection?: string): Promise<User>,
    findByEmailOrLogin(login: string, email: string, projection?: string): Promise<User>
}

userSchema.statics.findByEmail = function (email: string, projection?: string): Promise<User> {
    return this.findOne({ email }, projection)
}

userSchema.statics.findByEmailOrLogin = function (login: string, email: string, projection?: string): Promise<User> {
    return this.findOne({ $or: [{ login }, { email }] }, projection)
}

const hashPassword = function (obj: User, next: restify.Next) {
    bcrypt.hash(obj.password, environment.secutiry.saltRounds)
        .then(hash => {
            obj.password = hash
            next()
        }).catch(next)
}

const saveMiddleware = function (next: restify.Next) {
    const user: User = <User>this;
    if (!user.isModified('password'))
        next()
    else hashPassword(user, next)
}

const updateMiddleware = function (next: restify.Next) {
    if (!this.getUpdate().password) {
        next()
    } else {
        hashPassword(this.getUpdate(), next)
    }
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)

export const User = mongoose.model<User, UserModel>('User', userSchema);