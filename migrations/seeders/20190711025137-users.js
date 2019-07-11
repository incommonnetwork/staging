'use strict';
const path = require('path');
const bcrypt = require('bcryptjs');
const SEEDFILE = path.basename(__filename);


const now = new Date();
const createdAt = now;
const updatedAt = now;

const users = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']

const ITEMS = users.map(u => ({
    email: `${u}@${u}.${u}`,
    password: u + u + u,
    createdAt,
    updatedAt,
    SEEDFILE
}))

const seeder = module.exports = {
    TABLE: 'users',
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

        for (const i in seeder.ITEMS) {
            seeder.ITEMS[i].password = await bcrypt.hash(seeder.ITEMS[i].password, 10);
        }

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
