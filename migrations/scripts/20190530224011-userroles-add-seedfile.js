'use strict';

const migrator = module.exports = {
    TABLE: 'UserRole',
    COLUMN: 'SEEDFILE',

    up: async (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        const attributes = await queryInterface.describeTable(migrator.TABLE).catch(() => null)
        if (attributes && !attributes[migrator.COLUMN]) {
            await queryInterface.addColumn(migrator.TABLE, migrator.COLUMN, {
                type: Sequelize.STRING,
                allowNull: true
            })
        }
    },

    down: async (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
        const attributes = await queryInterface.describeTable(migrator.TABLE).catch(() => null)
        if (attributes && attributes[migrator.COLUMN]) {
            await queryInterface.removeColumn(migrator.TABLE, migrator.COLUMN, {
                type: Sequelize.STRING,
                allowNull: true
            })
        }
    }
};
