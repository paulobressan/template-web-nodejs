export const environment = {
    server: {
        port: process.env.SERVER_PORT || 4000,
        pageSize: process.env.PAGE_SIZE || 5
    },
    db: {
        url: process.env.URL_DB || 'mongodb://localhost/template-web'
    },
    secutiry: {
        saltRounds: process.env.SALT_ROUNDS || 10,
        jwtSecret: process.env.JWT_SECRET || 'secret-template-web'
    },
    log: {
        name: 'template-web',
        level: process.env.LOG_LEVEL || 'debug'
    }
}
