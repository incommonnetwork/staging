const env = require('../setup.env.js')(4531);
const moment = require('moment')

describe('registration service', () => {
    beforeAll(env.before);
    afterAll(env.after);

    beforeEach(async () => {
        this.api = env.initApi();
        this.rand = `${Math.floor(Math.random() * 1000000000)}`;
    });

    describe('admin', () => {
        beforeEach(async () => {
            await this.api.authenticate({
                strategy: 'local',
                email: 'admin@mock.admin',
                password: 'admin123'
            });
        });


        it('allows find', async () => {
            await this.api.service('registrations').find();
        });
    });

    describe('regstration', () => {
        beforeEach(async () => {
            this.dates = [moment().add(1, 'days').format('YYYY[/]MM[/]D')];
            this.city = await this.api.service('city').create({
                city: this.rand,
                state: this.rand,
                country: this.rand,
                latitude: 10,
                longitude: 10
            });

            this.neighborhood = await this.api.service('neighborhoods').create({
                cityId: this.city.id,
                neighborhood: this.rand,
                latitude: 10,
                longitude: 10
            });

            this.code = await this.api.service('codes').create({
                text: this.rand,
                description: this.rand,
                cityId: this.city.id,
                dates: this.dates
            });

            this.user = await this.api.service('users').create({
                email: `${this.rand}@registrations.com`,
                password: this.rand
            });

            await this.api.authenticate({
                strategy: 'local',
                email: `${this.rand}@registrations.com`,
                password: this.rand
            });
        });

        it('allows user to register', async () => {
            const registration = await this.api.service('registrations').create({
                neighborhoodId: this.neighborhood.id,
                codeId: this.code.id,
                dates: this.dates[0]
            });

            expect(registration.userId).toBe(this.user.id);
        });
    });

});