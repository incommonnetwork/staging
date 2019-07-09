// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
    const sequelizeClient = app.get('sequelizeClient');
    const registrations = sequelizeClient.define('registrations', {
        dates: {
            type: DataTypes.ARRAY(DataTypes.DATEONLY),
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
    registrations.associate = function (models) {
        models.registrations.belongsTo(models.neighborhoods);
        models.registrations.belongsTo(models.codes);
        models.registrations.belongsTo(models.users);
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
    };

    return registrations;
};
