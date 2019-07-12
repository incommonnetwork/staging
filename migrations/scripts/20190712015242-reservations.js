'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        const reservations = await queryInterface.sequelize.define('reservations', {
            date: {
                type: Sequelize.DATE,
                allowNull: false
            }
        }, {
                hooks: {
                    beforeCount(options) {
                        options.raw = true;
                    }
                }
            });

        await queryInterface.sequelize.sync()
        await queryInterface.addColumn('reservations', 'inviteId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'invites',
                key: 'id'
            }
        })

        await queryInterface.addColumn('reservations', 'restaurantId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'restaurants',
                key: 'id'
            }
        })

        await queryInterface.addColumn('invites', 'reservationId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'reservations',
                key: 'id'
            }
        })

        await queryInterface.addColumn('rsvps', 'reservationId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'restaurants',
                key: 'id'
            }
        })
    },

    down: async (queryInterface) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
        await queryInterface.removeColumn('invites', 'reservationId')

        await queryInterface.removeColumn('rsvps', 'reservationId')

        await queryInterface.dropTable('reservations')
    }
};
