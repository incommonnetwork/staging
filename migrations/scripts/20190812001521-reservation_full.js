'use strict';

const MIGRATION = module.exports = {

    up: async (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */

        await queryInterface.addColumn('reservations', 'full', {
            type: Sequelize.BOOLEAN,
            allowNull: false
        })


    },

    down: async (queryInterface) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        await queryInterface.removeColumn('reservations', 'full')
    }

};
