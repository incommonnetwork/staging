'use strict';

const MIGRATION = module.exports = {

    up: async (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
        await queryInterface.dropTable('registrations')

        await queryInterface.removeColumn('restaurants', 'neighborhoodId')

        await queryInterface.dropTable('neighborhoods')

        await queryInterface.removeColumn('rsvps', 'inviteId')

        await queryInterface.removeColumn('reservations', 'inviteId')

        await queryInterface.dropTable('invites')
    },

    down: async (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */


        const neighborhoods = queryInterface.sequelize.define('neighborhoods', {
            neighborhood: {
                type: Sequelize.STRING,
                allowNull: false
            },
            area: {
                type: Sequelize.STRING,
                allowNull: true
            },
            latitude: {
                type: Sequelize.DECIMAL(4, 2),
                allowNull: false
            },
            longitude: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false
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

        queryInterface.sequelize.define('invites', {
            date: {
                type: Sequelize.DATEONLY
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

        await queryInterface.addColumn('neighborhoods', 'cityId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'cities',
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

        await queryInterface.addColumn('invites', 'restaurantId', {
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

        await queryInterface.addColumn('rsvps', 'inviteId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'invites',
                key: 'id'
            }
        })

        await queryInterface.addColumn('reservations', 'inviteId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'invites',
                key: 'id'
            }
        })
    }

};
