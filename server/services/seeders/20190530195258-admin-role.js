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

    up: (queryInterface) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.bulkInsert('People', [{
            name: 'John Doe',
            isBetaMember: false
          }], {});
        */

        return queryInterface.bulkInsert(seeder.TABLE, seeder.ITEMS.map(i => ({ ...i, SEEDFILE })));
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
