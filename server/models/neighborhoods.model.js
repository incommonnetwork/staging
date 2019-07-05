// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
    const sequelizeClient = app.get('sequelizeClient');
    const neighborhoods = sequelizeClient.define('neighborhoods', {
        neighborhood: {
            type: DataTypes.STRING,
            allowNull: false
        },
        area: {
            type: DataTypes.STRING,
            allowNull: true
        },
        latitude: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: false
        },
        longitude: {
            type: DataTypes.DECIMAL(5, 2),
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
    neighborhoods.associate = function (models) {
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
    };

    return neighborhoods;
};
