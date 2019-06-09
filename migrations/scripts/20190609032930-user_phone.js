'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        await queryInterface.sequelize.define('phones', {
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
        })

        await queryInterface.sequelize.sync()

        await queryInterface.addColumn('users', 'phoneId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'phones',
                key: 'id'
            }
        })

        return

    },

    down: async (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
        await queryInterface.removeColumn('users', 'phoneId')
        await queryInterface.dropTable('phones')

    }
};

