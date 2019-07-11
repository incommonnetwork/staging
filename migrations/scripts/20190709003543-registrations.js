'use strict';

const MIGRATION = module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        queryInterface.sequelize.define('registrations', {

            dates: {
                type: Sequelize.ARRAY(Sequelize.DATEONLY)
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
        await queryInterface.addColumn('registrations', 'codeId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'codes',
                key: 'id'
            }
        })
        await queryInterface.addColumn('registrations', 'neighborhoodId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'neighborhoods',
                key: 'id'
            }
        })
        await queryInterface.addColumn('registrations', 'userId', {
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
        return queryInterface.dropTable('registrations')

        const newTypes = MIGRATION.types(Sequelize)

        for (const col in newTypes) {
            await queryInterface.removeColumn('codes', col)
        }
    }
};
