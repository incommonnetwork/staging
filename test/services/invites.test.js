const env = require('../setup.env.js')(4531);

describe('\'invites\' service', () => {
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
            await this.api.service('invites').find();
        });
    });

});
