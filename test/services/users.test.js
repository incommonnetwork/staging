const env = require('../setup.env.js')(3031);
const fetch = require('node-fetch');
const initApi = env.initApi;
let rand = Math.random();

describe('\'users\' service', () => {
    beforeAll(env.before);

    afterAll(env.after);

    beforeEach(async () => {
        this.api = initApi();
        this.service = this.api.service('users');
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


    describe('signup', () => {

        beforeEach(async () => {
            this.run = `${Math.random()}`;
            const strategy = 'local';
            const email = `${this.run}@example.com`;
            const password = `${this.run}`;
            this.creds = { strategy, email, password };
        });

        it('handles no email', async () => {
            expect.assertions(9);

            await this.service.create({}).catch(e => {
                expect(e.code).toBe(400);
                expect(e.name).toBe('BadRequest');

                expect(e.errors).toHaveLength(2);
                expect(e.errors[0]).toBeInstanceOf(Object);
                expect(e.errors[0].type).toBe('notNull Violation');
                expect(e.errors[0].path).toBe('email');
                expect(e.errors[1]).toBeInstanceOf(Object);
                expect(e.errors[1].type).toBe('notNull Violation');
                expect(e.errors[1].path).toBe('password');
            });

        });

        it('handles no password', async () => {
            expect.assertions(6);

            await this.service.create({
                email: `${rand}@example.com`
            }).catch(e => {
                expect(e.code).toBe(400);
                expect(e.name).toBe('BadRequest');

                expect(e.errors).toHaveLength(1);
                expect(e.errors[0]).toBeInstanceOf(Object);
                expect(e.errors[0].type).toBe('notNull Violation');
                expect(e.errors[0].path).toBe('password');
            });
        });

        it('handles invalid password type', async () => {
            expect.assertions(3);

            await this.service.create({
                email: `${rand}@example.com`,
                password: rand
            }).catch(e => {
                expect(e.code).toBe(500);
                expect(e.name).toBe('GeneralError');
                expect(e.message).toBe('Illegal arguments: number, string');
            });
        });

        it('handles create', async () => {
            expect.assertions(3);

            const email = `${rand}@example.com`;

            const res = await this.service.create({
                email,
                password: `${rand}`
            });

            expect(res.id).toBeTruthy();
            expect(res.email).toBe(email);
            expect(res.password).toBeFalsy();
        });

        it('handles duplicate create', async () => {
            expect.assertions(5);

            const email = `${rand}@example.com`;

            await this.service.create({
                email,
                password: `${rand}`
            }).catch(e => {
                expect(e.code).toBe(400);
                expect(e.errors).toHaveLength(1);
                expect(e.errors[0]).toBeInstanceOf(Object);
                expect(e.errors[0].type).toBe('unique violation');
                expect(e.errors[0].path).toBe('email');
            });
        });

        it('rejects creating admin', async () => {
            expect.assertions(1);

            await this.service.create(this.creds, {
                query: {
                    roles: 'admin'
                }
            }).catch(e => {
                expect(e.code).toBe(403);
            });
        });

        describe('associates with phone number', () => {
            beforeEach(async () => {
                this.number = `+1${Math.floor(Math.random() * 1000000000)}`;
                this.run = `${Math.random()}`;
                this.api = env.initApi();
                await this.api.authenticate({
                    strategy: 'local',
                    email: 'admin@mock.admin',
                    password: 'admin123'
                });

                await fetch(`${env.getApi('/sms')}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        From: this.number,
                        FromCity: 'BOULDER',
                        FromZip: '80301',
                        FromCountry: 'UNITED STATES',
                        FromState: 'CO',
                        body: this.code
                    })
                });
            });

            it('associates', async () => {
                expect.assertions(1);

                const { id } = await this.api.service('users').create({
                    email: `${this.run}@example.com`,
                    password: this.run,
                    confirm_password: this.run,
                    phoneId: 1
                });

                const gotten = await this.api.service('users').get(id);
                expect(gotten.phone.id).toBe(1);
            });
        });

    });

    describe('authentication', () => {
        beforeEach(async () => {
            this.run = `${Math.random()}`;
            const strategy = 'local';
            const email = `${this.run}@example.com`;
            const password = `${this.run}`;
            this.creds = { strategy, email, password };


            await this.service.create(this.creds);
        });

        it('should succeed on correct credentials', async () => {
            expect.assertions(1);

            const res = await this.api.authenticate(this.creds);
            expect(res.accessToken).toBeTruthy();
        });

        it('should fail on no strategy', async () => {
            expect.assertions(2);

            const creds = {
                ...this.creds,
                strategy: undefined
            };

            await this.api.authenticate(creds).catch(e => {
                expect(e.code).toBe(401);
                expect(e.message).toBe('Could not find stored JWT and no authentication strategy was given');
            });
        });

        it('should fail on bad email', async () => {
            expect.assertions(2);

            const creds = {
                ...this.creds,
                email: `${Math.random()}@example.com`
            };

            await this.api.authenticate(creds).catch(e => {
                expect(e.code).toBe(401);
                expect(e.message).toBe('Invalid login');
            });
        });

        it('should fail on no password', async () => {
            expect.assertions(2);

            const creds = {
                ...this.creds,
                password: undefined
            };

            await this.api.authenticate(creds).catch(e => {
                expect(e.code).toBe(400);
                expect(e.message).toBe('Missing credentials');
            });
        });

        it('should fail on wrong password', async () => {
            expect.assertions(2);

            const creds = {
                ...this.creds,
                password: `${Math.random()}`
            };

            await this.api.authenticate(creds).catch(e => {
                expect(e.code).toBe(401);
                expect(e.message).toBe('Invalid login');
            });
        });

    });

    describe('logged in', () => {
        describe('base user', () => {
            beforeEach(async () => {
                this.run = `${Math.random()}`;
                const strategy = 'local';
                const email = `${this.run}@example.com`;
                const password = `${this.run}`;
                this.creds = { strategy, email, password };


                const { id } = await this.service.create(this.creds);
                this.id = id;

                await this.api.authenticate(this.creds);
            });

            describe('should forbid', () => {
                it('creating a second user', async () => {
                    expect.assertions(1);
                    const bad = `${Math.random()}`;
                    await this.api.authenticate(this.creds);

                    await this.service.create({
                        strategy: 'local',
                        email: `${bad}@example.com`,
                        password: `${bad}`
                    }).catch(e => {
                        expect(e.code).toBe(403);
                    });
                });

                it('updating another user', async () => {
                    expect.assertions(2);

                    await this.service.update(1, {
                        email: 'update@attacker.com',
                        password: 'attack'
                    }).catch(e => {
                        expect(e.code).toBe(403);
                        expect(e.message).toBe('Not Authorized');
                    });
                });

                it('patching another user', async () => {
                    expect.assertions(2);

                    await this.service.patch(1, {
                        password: 'attacker'
                    }).catch(e => {
                        expect(e.code).toBe(403);
                        expect(e.message).toBe('Not Authorized');
                    });
                });

                it('removing another user', async () => {
                    expect.assertions(2);

                    await this.service.remove(1).catch(e => {
                        expect(e.code).toBe(403);
                        expect(e.message).toBe('Not Authorized');
                    });
                });
            });

            describe('should allow', async () => {


                it('getting self', async () => {
                    expect.assertions(1);

                    const user = await this.service.get(1);
                    expect(user.id).toBe(this.id);
                });

                it('finding self', async () => {
                    expect.assertions(3);

                    const res = await this.service.find({});

                    expect(res.total).toBe(1);
                    expect(res.data[0].id).toBe(this.id);
                    expect(res.data[0].email).toBe(this.creds.email);
                });

                it('getting self', async () => {

                    expect.assertions(1);

                    const res = await this.service.get(1);
                    expect(res.interests).toBeTruthy();
                });

            });
        });

        describe('admin', () => {
            beforeEach(async () => {
                this.run = `${Math.random()}`;
                const strategy = 'local';
                // see server/services/seeders/20190530221359-mock-admin-user.js
                const email = 'admin@mock.admin';
                const password = 'admin123';

                this.creds = { strategy, email, password };

                await this.api.authenticate(this.creds);
            });

            describe('should allow', () => {
                it('finding all', async () => {
                    expect.assertions(1);

                    const res = await this.service.find({});

                    expect(res.total).toBeGreaterThan(10);
                });
            });
        });

    });
});
