import 'jest'
import * as request from 'supertest'

let address = (<any>global).address

test('get /users', () => {
    return request(address)
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})

test('post /users', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'Usuario Teste',
            email: 'usuario@email.com',
            login: 'usuario.teste',
            password: '12345678'
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.name).toBe('Usuario Teste')
            expect(response.body.email).toBe('usuario@email.com')
            expect(response.body.login).toBe('usuario.teste')
            expect(response.body.isAtivo).toBe(true)
            expect(response.body.password).toBeUndefined()
            expect(response.body.profiles).toBeInstanceOf(Array)
        }).catch(fail)
})

test('get /users?email', () => {
    return request(address)
        .get('/users?email=usuario@email.com')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})

test('put /users', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'Usuario Teste',
            email: 'usuario2@email.com',
            login: 'usuario2.teste',
            password: '12345678'
        })
        .then(response => request(address)
            .put(`/users/${response.body._id}`)
            .send({
                name: 'usuario teste 1',
                email: 'usuario1@email.com',
                login: 'usuario.teste1',
                password: '12345678'
            }))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.name).toBe('usuario teste 1')
            expect(response.body.email).toBe('usuario1@email.com')
            expect(response.body.login).toBe('usuario.teste1')
            expect(response.body.isAtivo).toBe(true)
            expect(response.body.password).toBeUndefined()
            expect(response.body.profiles).toBeInstanceOf(Array)
        }).catch(fail)
})

test('patch /users', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'Usuario Teste',
            email: 'usuario3@email.com',
            login: 'usuario3.teste',
            password: '12345678'
        })
        .then(response => request(address)
            .patch(`/users/${response.body._id}`)
            .send({
                name: 'Usuario2 Teste2',
            }))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.name).toBe('Usuario2 Teste2')
            expect(response.body.email).toBe('usuario3@email.com')
            expect(response.body.login).toBe('usuario3.teste')
            expect(response.body.isAtivo).toBe(true)
            expect(response.body.password).toBeUndefined()
            expect(response.body.profiles).toBeInstanceOf(Array)
        }).catch(fail)
})