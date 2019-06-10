// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
    const sequelizeClient = app.get('sequelizeClient');
    const codes = sequelizeClient.define('codes', {
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
    codes.associate = function (models) {
        models.codes.belongsTo(models.users, { as: 'assigned_by' })
        models.codes.belongsToMany(models.users, { as: 'attendees', through: 'user_codes' })
        models.users.belongsToMany(models.codes, { as: 'interests', through: 'user_codes' })
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
    };

    return codes;
};
