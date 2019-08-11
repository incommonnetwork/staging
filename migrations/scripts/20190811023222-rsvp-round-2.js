'use strict';

const MIGRATION = module.exports = {

    up: async (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
        await queryInterface.removeColumn('rsvps', 'userId')
        await queryInterface.removeColumn('rsvps', 'accepted')

        await queryInterface.addColumn('rsvps', 'phoneId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'phones',
                key: 'id'
            }
        })


    },

    down: async (queryInterface) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        await queryInterface.addColumn('rsvps', 'userId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        })

        await queryInterface.addColumn('rsvps', 'accepted', {
            type: Sequelize.BOOLEAN,
            allowNull: false
        })


        await queryInterface.removeColumn('rsvps', 'phoneId')
    }

};
