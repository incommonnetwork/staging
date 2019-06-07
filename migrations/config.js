
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

const PGRES_URL = process.env.POSTGRES_CONNECTION || "postgres://incommon:incommon@localhost:5432/incommon"

module.exports = {
    [env]: {
        dialect,
        url: PGRES_URL,
        migrationStorageTableName: '_migrations',
        dialectOptions: {
            ssl: useSSL
        }
    }
};