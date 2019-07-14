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

});
