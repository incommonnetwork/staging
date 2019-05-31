'use strict';
const path = require('path');
const bcrypt = require('bcryptjs');
const SEEDFILE = path.basename(__filename);


const now = new Date();
const createdAt = now;
const updatedAt = now;

const ITEMS = process.env.NODE_ENV === 'production' ? [] : [{
    email: 'admin@mock.admin',
    password: 'admin123',
    createdAt,
    updatedAt,
    SEEDFILE
}];

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

        const [[user]] = await queryInterface.sequelize.query('SELECT * FROM users WHERE email = \'admin@mock.admin\'');
        const [[role]] = await queryInterface.sequelize.query('SELECT * FROM roles WHERE type = \'admin\'');

        await queryInterface.bulkInsert('UserRole', [{
            userId: user.id,
            roleId: role.id,
            SEEDFILE,
            createdAt,
            updatedAt
        }]);
    },

    down: async (queryInterface) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
        await queryInterface.bulkDelete(seeder.TABLE, { SEEDFILE });
        await queryInterface.bulkDelete('UserRole', { SEEDFILE });
    }
};
