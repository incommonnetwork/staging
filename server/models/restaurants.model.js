// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
    const sequelizeClient = app.get('sequelizeClient');
    const restaurants = sequelizeClient.define('restaurants', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        map: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        hooks: {
            beforeCount(options) {
                options.raw = true;
            }
        }
    });

    // eslint-disable-next-line no-unused-vars
    restaurants.associate = function (models) {
        models.restaurants.belongsTo(models.neighborhoods);
        models.restaurants.belongsTo(models.cities);
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
    };

    return restaurants;
};
