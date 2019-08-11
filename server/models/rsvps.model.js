// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
    const sequelizeClient = app.get('sequelizeClient');
    const rsvps = sequelizeClient.define('rsvps', {
        total: {
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
    rsvps.associate = function (models) {
        models.rsvps.belongsTo(models.phones);
        models.rsvps.belongsTo(models.reservations);

        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
    };

    return rsvps;
};
