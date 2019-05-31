'use strict';
const path = require('path');
const SEEDFILE = path.basename(__filename);

const now = new Date();
const createdAt = now;
const updatedAt = now;

const seeder = module.exports = {
    TABLE: 'roles',

    ITEMS: [
        {
            type: 'admin',
            createdAt,
            updatedAt
        }
    ],

    up: async (queryInterface) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.bulkInsert('People', [{
            name: 'John Doe',
            isBetaMember: false
          }], {});
        */

        const attributes = await queryInterface.describeTable(seeder.TABLE).catch(() => null)
        if (attributes) {
            return queryInterface.bulkInsert(seeder.TABLE, seeder.ITEMS.map(i => ({ ...i, SEEDFILE })))
                .catch(e => {
                    console.error('ADMIN_ROLE ERROR')
                    console.error(e)
                    throw e
                });
        }
    },

    down: (queryInterface) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
        return queryInterface.bulkDelete(seeder.TABLE, { SEEDFILE });
    }
};
