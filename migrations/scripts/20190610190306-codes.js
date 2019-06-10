'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        const codes = queryInterface.sequelize.define('codes', {
            text: {
                type: Sequelize.STRING,
                allowNull: false
            }
        }, {
                hooks: {
                    beforeCount(options) {
                        options.raw = true;
                    }
                }
            });

        const users = queryInterface.sequelize.define('users', {

            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
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

        const user_codes = queryInterface.sequelize.define('user_codes', {
            SEEDFILE: {
                type: Sequelize.STRING,
                allowNull: true
            }
        });

        codes.belongsToMany(users, { as: 'attendees', through: user_codes })
        users.belongsToMany(codes, { as: 'interests', through: user_codes })

        await queryInterface.sequelize.sync()
        await queryInterface.addColumn('codes', 'assignedById', {
            type: Sequelize.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        })

    },

    down: async (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */

        await queryInterface.removeColumn('codes', 'assignedById')
        await queryInterface.dropTable('codes')
    }
};
