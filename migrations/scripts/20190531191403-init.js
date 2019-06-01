'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        const roles = queryInterface.sequelize.define('roles', {
            type: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            SEEDFILE: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true
            }
        });

        const users = queryInterface.sequelize.define('users', {

            email: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },


            googleId: { type: Sequelize.STRING },

            facebookId: { type: Sequelize.STRING },

            githubId: { type: Sequelize.STRING },

            SEEDFILE: {
                type: Sequelize.STRING,
                allowNull: true
            }

        })

        const user_roles = queryInterface.sequelize.define('user_roles', {
            SEEDFILE: {
                type: Sequelize.STRING,
                allowNull: true
            }

        })

        users.belongsToMany(roles, { through: user_roles })

        return queryInterface.sequelize.sync()

    },

    down: async (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
        await queryInterface.dropTable('user_roles')
        await queryInterface.dropTable('users')
        await queryInterface.dropTable('roles')
    }
};

