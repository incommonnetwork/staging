// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
    const sequelizeClient = app.get('sequelizeClient');
    const cities = sequelizeClient.define('cities', {
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        latitude: {
            type: DataTypes.DECIMAL(3, 1),
            allowNull: false
        },
        longitude: {
            type: DataTypes.DECIMAL(4, 1),
            allowNull: false
        },
        SEEDFILE: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
            hooks: {
                beforeCount(options) {
                    options.raw = true;
                }
            }
        });

    // eslint-disable-next-line no-unused-vars
    cities.associate = function (models) {
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
    };

    return cities;
};
