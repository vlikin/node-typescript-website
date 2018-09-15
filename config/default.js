module.exports = {
    secret: 'Fish',
    languages: ['en', 'ru', 'ua'],
    server: {
        port: 2909
    },
    db: {
        name: 'website',
        host: 'localhost',
        port: 27017
    },
    dynamicConfig: {
        adminPassword: 'admin'
    },
    client: {
        defaultLanguage: 'en'
    }
};
