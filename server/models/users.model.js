// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
    const sequelizeClient = app.get('sequelizeClient');
    const users = sequelizeClient.define('users', {

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },


        googleId: { type: Sequelize.STRING },

        facebookId: { type: Sequelize.STRING },

        githubId: { type: Sequelize.STRING },

        SEEDFILE: {
            type: Sequelize.STRING,
            allowNull: true
        }

    }, {
        hooks: {
            beforeCount(options) {
                options.raw = true;
            }
        }
    });

    sequelizeClient.define('UserRole', {
        SEEDFILE: Sequelize.STRING
    });

    // eslint-disable-next-line no-unused-vars
    users.associate = function (models) {
        models.users.belongsToMany(models.roles, { through: 'UserRole' });
    };

    return users;
};
