'use strict';

const MIGRATION = module.exports = {

    up: async (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */

        queryInterface.sequelize.define('leads', {
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            city: {
                type: Sequelize.STRING,
                allowNull: true
            },
            state: {
                type: Sequelize.STRING,
                allowNull: false
            },
            country: {
                type: Sequelize.STRING,
                allowNull: false
            },
            use: {
                type: Sequelize.STRING,
                allowNull: false
            },
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

        await queryInterface.sequelize.sync()
    },

    down: async (queryInterface) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        await queryInterface.dropTable('leads')
    }

};
