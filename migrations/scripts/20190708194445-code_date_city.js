'use strict';

const MIGRATION = module.exports = {
    types: (Sequelize) => ({
        description: { type: Sequelize.STRING },

        cityId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'cities',
                key: 'id'
            }
        },

        dates: {
            type: Sequelize.ARRAY(Sequelize.DATEONLY)
        }
    }),
    up: async (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */


        const newTypes = MIGRATION.types(Sequelize)

        for (const col in newTypes) {
            await queryInterface.addColumn('codes', col, newTypes[col])
        }
    },

    down: async (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */

        const newTypes = MIGRATION.types(Sequelize)

        for (const col in newTypes) {
            await queryInterface.removeColumn('codes', col)
        }
    }
};
