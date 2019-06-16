'use strict';

const MIGRATION = module.exports = {
    types: (Sequelize) => ({
        firstName: { type: Sequelize.STRING },

        city: { type: Sequelize.STRING },

        state: { type: Sequelize.STRING },

        telephone: { type: Sequelize.STRING },

        textInvites: { type: Sequelize.BOOLEAN },

        dinnerTime: { type: Sequelize.STRING },

        availability: { type: Sequelize.ARRAY(Sequelize.STRING) },

        notice: { type: Sequelize.STRING },

        diet: { type: Sequelize.ARRAY(Sequelize.STRING) }
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
            await queryInterface.addColumn('users', col, newTypes[col])
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
            await queryInterface.removeColumn('users', col)
        }
    }
};
