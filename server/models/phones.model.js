// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
    const sequelizeClient = app.get('sequelizeClient');
    const phones = sequelizeClient.define('phones', {
        number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        zip: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        SEEDFILE: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    // eslint-disable-next-line no-unused-vars
    phones.associate = function () {
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
    };

    return phones;
};
