import 'jest'
import * as request from 'supertest'

let address = (<any>global).address

test('get /', () => {
    return request(address)
        .get('/')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})
