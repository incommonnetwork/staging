// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
    const sequelizeClient = app.get('sequelizeClient');
    const invites = sequelizeClient.define('invites', {
        date: {
            type: DataTypes.DATE,
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
    invites.associate = function (models) {
        models.invites.belongsTo(models.restaurants)
        models.invites.hasMany(models.registrations)
        models.invites.hasMany(models.rsvps)
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
    };

    return invites;
};
