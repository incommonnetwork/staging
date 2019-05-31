
const app = require('../server/app');
const env = process.env.NODE_ENV || 'development';
const dialect = 'postgres';

const useSSL = (() => {
    let _ssl = false;
    switch (process.env.NODE_ENV) {
        case 'travis':
            _ssl = true;
            break;
        case 'production':
            _ssl = true;
    }
    return _ssl;
})();

module.exports = {
    [env]: {
        dialect,
        url: app.get(dialect),
        migrationStorageTableName: '_migrations',
        dialectOptions: {
            ssl: useSSL
        }
    }
};