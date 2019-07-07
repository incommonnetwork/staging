'use strict';
const path = require('path');
const SEEDFILE = path.basename(__filename);

const now = new Date();
const createdAt = now;
const updatedAt = now;
const latitude = 40.7
const longitude = -73.9

const city = {
    city: 'New York',
    state: 'NY',
    country: 'US',
    latitude,
    longitude,
    SEEDFILE,
    createdAt,
    updatedAt
}

const burroughs = {
    "Manhattan": [
        "Midtown",
        "Upper East Side",
        "Greenwich Village",
        "Upper West Side",
    ],
    "Brooklyn": [
        "Williamsburg",
        "Park Slope",
        "Prospect Heights"
    ],
    "Bronx": [
        "Fordham",
        "Riverdale",
        "South Bronx"
    ],
    "Staten Island": [
        "Great Kills",
        "Greater St. George",
    ],
    "Queens": [
        "Astoria",
        "Jackson Heights",
        "Sunnyside",
    ]

}

const seeder = module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.bulkInsert('People', [{
            name: 'John Doe',
            isBetaMember: false
          }], {});
        */
        await queryInterface.bulkInsert('cities', [city]);
        const [[cityEntry]] = await queryInterface.sequelize.query(`SELECT * FROM cities WHERE city='${city.city}'`)

        const neighborhoods = []

        for (const area in burroughs) {
            const _neighborhoods = burroughs[area]
            for (const neighborhood of _neighborhoods) {
                neighborhoods.push({
                    cityId: cityEntry.id,
                    neighborhood,
                    area,
                    latitude,
                    longitude,
                    createdAt,
                    updatedAt,
                    SEEDFILE
                })
            }
        }

        await queryInterface.bulkInsert('neighborhoods', neighborhoods)
    },

    down: async (queryInterface) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
        await queryInterface.bulkDelete('neighborhoods', { SEEDFILE });
        await queryInterface.bulkDelete('cities', { SEEDFILE })
    }
};