export const environment = {
    server: {
        port: process.env.SERVER_PORT || 4000,
        pageSize: process.env.PAGE_SIZE || 5
    },
    db: {
        url: process.env.URL_DB || 'mongodb://localhost/erp-food-web'        
    },
    secutiry: {
        saltRounds: process.env.SALT_ROUNDS || 10,
        jwtSecret: process.env.JWT_SECRET || 'secret-erp-food-web'
    }
}