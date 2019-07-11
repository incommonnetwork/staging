'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        const restaurants = queryInterface.sequelize.define('restaurants', {
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false
            }
        }, {
                hooks: {
                    beforeCount(options) {
                        options.raw = true;
                    }
                }
            });

        const invites = queryInterface.sequelize.define('invites', {
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

        const rsvps = queryInterface.sequelize.define('rsvps', {
            accepted: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            }
        }, {
                hooks: {
                    beforeCount(options) {
                        options.raw = true;
                    }
                }
            });

        invites.hasMany(rsvps)
        invites.belongsTo(restaurants)
        await queryInterface.sequelize.sync()

        await queryInterface.addColumn('rsvps', 'userId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        })

        await queryInterface.addColumn('restaurants', 'neighborhoodId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'neighborhoods',
                key: 'id'
            }
        })

        await queryInterface.addColumn('registrations', 'inviteId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'invites',
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

        await queryInterface.dropTable('rsvps')
        await queryInterface.removeColumn('registrations', 'inviteId')
        await queryInterface.dropTable('invites')
        await queryInterface.dropTable('restaurants')
    }
};
