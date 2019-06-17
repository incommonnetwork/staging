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
        },

        firstName: { type: Sequelize.STRING },

        city: { type: Sequelize.STRING },

        state: { type: Sequelize.STRING },

        telephone: { type: Sequelize.STRING },

        textInvites: { type: Sequelize.BOOLEAN },

        dinnerTime: { type: Sequelize.STRING },

        availability: { type: Sequelize.ARRAY(Sequelize.STRING) },

        notice: { type: Sequelize.STRING },

        diet: { type: Sequelize.ARRAY(Sequelize.STRING) }

    }, {
        hooks: {
            beforeCount(options) {
                options.raw = true;
            }
        }
    });

    sequelizeClient.define('user_roles', {
        SEEDFILE: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });

    sequelizeClient.define('phones', {
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        country: {
            type: Sequelize.STRING,
            allowNull: true
        },
        city: {
            type: Sequelize.STRING,
            allowNull: true
        },
        state: {
            type: Sequelize.STRING,
            allowNull: true
        },
        zip: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        SEEDFILE: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });

    // eslint-disable-next-line no-unused-vars
    users.associate = function (models) {
        models.users.belongsToMany(models.roles, { through: 'user_roles' });
        models.users.belongsTo(models.phones);
    };

    return users;
};
