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
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
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
    codes.associate = function (models) {
        models.codes.belongsTo(models.users, { as: 'assigned_by' });
        models.codes.belongsToMany(models.users, { as: 'attendees', through: 'user_codes' });
        models.users.belongsToMany(models.codes, { as: 'interests', through: 'user_codes' });
        models.codes.belongsTo(models.cities);
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
    };

    return codes;
};
