// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
    const sequelizeClient = app.get('sequelizeClient');
    const reservations = sequelizeClient.define('reservations', {
        text: {
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
    reservations.associate = function (models) {
        models.reservations.belongsTo(models.invites);
        models.reservations.belongsTo(models.restaurants);
        models.reservations.hasOne(models.invites);
        models.reservations.hasMany(models.rsvps);
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
    };

    return reservations;
};
