'use strict';

const MIGRATION = module.exports = {

    up: async (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
        await queryInterface.removeColumn('restaurants', 'cityId').catch(() => { })


        await queryInterface.addColumn('restaurants', 'city', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        })

        await queryInterface.addColumn('restaurants', 'state', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        })

        await queryInterface.addColumn('restaurants', 'country', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        })

        await queryInterface.addColumn('reservations', 'capacity', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        })

        await queryInterface.addColumn('reservations', 'codeId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        })

    },

    down: async (queryInterface) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        await queryInterface.addColumn('restaurants', 'cityId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'cities',
                key: 'id'
            }
        })

        await queryInterface.removeColumn('restaurants', 'city')
        await queryInterface.removeColumn('restaurants', 'state')
        await queryInterface.removeColumn('restaurants', 'country')
        await queryInterface.removeColumn('reservations', 'capacity')
    }

};
