'use strict';
const path = require('path');
const bcrypt = require('bcryptjs');
const SEEDFILE = path.basename(__filename);


const now = new Date();
const createdAt = now;
const updatedAt = now;

const ITEMS = []

if (process.env.NODE_ENV !== 'production') {
    for (const i of [1, 2, 3, 4, 5]) {
        ITEMS.push({
            text: `test${i}`,
            assignedById: 1,
            createdAt,
            updatedAt,
            SEEDFILE
        })
    }
}

const seeder = module.exports = {
    TABLE: 'codes',
    ITEMS,
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
        await queryInterface.bulkInsert(seeder.TABLE, seeder.ITEMS);
    },

    down: async (queryInterface) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
        await queryInterface.bulkDelete(seeder.TABLE, { SEEDFILE });
    }
};
