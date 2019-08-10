// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
    const sequelizeClient = app.get('sequelizeClient');
    const reservations = sequelizeClient.define('reservations', {
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER,
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
    reservations.associate = function (models) {
        models.reservations.belongsTo(models.restaurants);
        models.reservations.belongsTo(models.codes);
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
    };

    return reservations;
};
