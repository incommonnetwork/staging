
const env = require('../setup.env.js')(3031);
const ADMIN = require('../../migrations/seeders/20190530195258-admin-role.js').ITEMS;

const EXPECTED_ROLES = [ADMIN].flat();


const initApi = env.initApi;

describe('\'roles\' service', () => {
    beforeAll(env.before);
    afterAll(env.after);

    beforeEach(() => {
        this.api = initApi();
        this.service = this.api.service('roles');
    });

    afterEach(() => {
        this.api = null;
        this.service = null;
    });

    it('registered the service', () => {
        expect.assertions(1);
        expect(this.service).toBeTruthy();
    });

    describe('Client Writes forbidden', () => {
        for (const method of ['create', 'update', 'patch', 'remove']) {
            it(`rejects client ${method}`, async () => {
                expect.assertions(1);

                const arg1 = method === 'create' ? {} : 1;
                const arg2 = ['update', 'patch'].indexOf(method) >= 0 ? {} : undefined;

                await this.service[method](arg1, arg2).catch(e => {
                    expect(e.code).toBe(403);
                });
            });
        }
    });


    describe('Roles', () => {
        it('finds correct number', async () => {
            expect.assertions(2);

            const roles = await this.service.find();

            expect(roles).toBeTruthy();
            expect(roles.total).toBe(EXPECTED_ROLES.length);
        });
    });

    // these tests require access to the server app, only run on ci
    if (process.env.TEST_ENV === 'ci') {
        //describe('');
    }

});
