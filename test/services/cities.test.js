const env = require('../setup.env.js')(3031);
const initApi = env.initApi;

describe('cities service', () => {
    beforeAll(env.before);

    afterAll(env.after);

    beforeEach(async () => {
        this.api = initApi();
        this.service = this.api.service('users');
        this.rand = `${Math.random()}`;
    });

    describe('logged out', () => {
        it('GET returns 401 unauthorized', async () => {
            expect.assertions(3);

            await this.service.find().catch(e => {
                expect(e.type).toBe('FeathersError');
                expect(e.code).toBe(401);
                expect(e.name).toBe('NotAuthenticated');
            });
        });
    });


    describe('user', () => {

        beforeEach(async () => {
            this.run = `${Math.random()}`;
            const strategy = 'local';
            const email = `${this.run}@example.com`;
            const password = `${this.run}`;
            this.creds = { strategy, email, password };
            await this.api.service('users').create({
                email,
                password
            });
            await this.api.authenticate(this.creds);
        });


        it('rejects create', async () => {
            expect.assertions(1);

            await this.service.create({
                city: this.run,
                country: this.run,
                latitude: 10,
                longitude: 10
            }).catch(e => {
                expect(e.code).toBe(401);
            });
        });

    });
});
