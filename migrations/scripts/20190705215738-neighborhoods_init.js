'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        const neighborhoods = queryInterface.sequelize.define('neighborhoods', {
            neighborhood: {
                type: Sequelize.STRING,
                allowNull: false
            },
            area: {
                type: Sequelize.STRING,
                allowNull: true
            },
            latitude: {
                type: Sequelize.DECIMAL(4, 2),
                allowNull: false
            },
            longitude: {
                type: Sequelize.DECIMAL(5, 2),
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

        const cities = queryInterface.sequelize.define('cities', {
            city: {
                type: Sequelize.STRING,
                allowNull: false
            },
            state: {
                type: Sequelize.STRING,
                allowNull: false
            },
            country: {
                type: Sequelize.STRING,
                allowNull: false
            },
            latitude: {
                type: Sequelize.DECIMAL(3, 1),
                allowNull: false
            },
            longitude: {
                type: Sequelize.DECIMAL(4, 1),
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

        cities.hasMany(neighborhoods)

        await queryInterface.sequelize.sync()
    },

    down: async (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
        await queryInterface.dropTable('codes')
    }
};
