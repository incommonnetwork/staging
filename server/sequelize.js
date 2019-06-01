const Sequelize = require('sequelize');

const useSSL = (() => {
    let _ssl = false;
    switch (process.env.NODE_ENV) {
        case 'staging':
            _ssl = true;
            break
        case 'travis':
            _ssl = true;
            break;
        case 'test':
            _ssl = (process.env.TEST_ENV === 'ci') ? true : false;
            break;
        case 'production':
            _ssl = true;
    }
    return _ssl;
})();

module.exports = function (app) {
    const connectionString = app.get('postgres');
    const sequelize = new Sequelize(connectionString, {
        dialect: 'postgres',
        logging: false,
        operatorsAliases: false,
        define: {
            freezeTableName: true
        },
        dialectOptions: {
            ssl: useSSL
        }
    });
    const oldSetup = app.setup;

    app.set('sequelizeClient', sequelize);

    app.setup = async function (...args) {
        const result = oldSetup.apply(this, args);

        // Set up data relationships
        const models = sequelize.models;
        Object.keys(models).forEach(name => {
            if ('associate' in models[name]) {
                models[name].associate(models);
            }
        });

        // Sync to the database
        await sequelize.sync();

        return result;
    };
};
