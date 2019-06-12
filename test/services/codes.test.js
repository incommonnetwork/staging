
const env = require('../setup.env.js')(4531);

describe('\'codes\' service', () => {
    beforeAll(env.before);
    afterAll(env.after);

    beforeEach(async () => {
        this.api = env.initApi();
        this.code = `${Math.floor(Math.random() * 1000000000)}`;
    });

    describe('unauthenticated', async () => {
        beforeEach(async () => {
            this.service = this.api.service('codes');
        });

        it('throws on get', async () => {
            expect.assertions(1);

            await this.service.get(1).catch(e => {
                expect(e.code).toBe(401);
            });
        });

        it('throws on find', async () => {
            expect.assertions(1);

            await this.service.find({}).catch(e => {
                expect(e.code).toBe(401);
            });
        });

        it('throws on create', async () => {
            expect.assertions(1);

            await this.service.create({
                text: this.code
            }).catch(e => {
                expect(e.code).toBe(401);
            });
        });

        it('throws on patch', async () => {
            expect.assertions(1);

            await this.service.patch(1, {
                text: this.code
            }).catch(e => {
                expect(e.code).toBe(401);
            });
        });


        it('throws on update', async () => {
            expect.assertions(1);

            await this.service.update(1, {
                text: this.code
            }).catch(e => {
                expect(e.code).toBe(401);
            });
        });

        it('throws on remove', async () => {
            expect.assertions(1);

            await this.service.remove(1).catch(e => {
                expect(e.code).toBe(401);
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


                const { id } = await this.api.service('users').create(this.creds);
                this.id = id;

                await this.api.authenticate(this.creds);
            });

            describe('should forbid all ops', () => {
                beforeEach(async () => {
                    this.service = this.api.service('codes');
                });

                it('throws on get', async () => {
                    expect.assertions(1);

                    await this.service.get(1).catch(e => {
                        expect(e.code).toBe(403);
                    });
                });

                it('throws on find', async () => {
                    expect.assertions(1);

                    await this.service.find({}).catch(e => {
                        expect(e.code).toBe(403);
                    });
                });

                it('throws on create', async () => {
                    expect.assertions(1);

                    await this.service.create({
                        text: this.code
                    }).catch(e => {
                        expect(e.code).toBe(403);
                    });
                });

                it('throws on patch', async () => {
                    expect.assertions(1);

                    await this.service.patch(1, {
                        text: this.code
                    }).catch(e => {
                        expect(e.code).toBe(403);
                    });
                });


                it('throws on update', async () => {
                    expect.assertions(1);

                    await this.service.update(1, {
                        text: this.code
                    }).catch(e => {
                        expect(e.code).toBe(403);
                    });
                });

                it('throws on remove', async () => {
                    expect.assertions(1);

                    await this.service.remove(1).catch(e => {
                        expect(e.code).toBe(403);
                    });
                });
            });

            describe('should allow', async () => {

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

            describe('should allow all ops', () => {
                beforeEach(async () => {
                    this.service = this.api.service('codes')
                    this.code_id = (await this.service.create({
                        text: this.run
                    })).id
                })

                it('allows create', async () => {
                    await this.service.create({
                        text: this.run
                    })
                })

                it('allows get', async () => {
                    await this.service.get(this.code_id)
                })

                it('allows find', async () => {
                    await this.service.find({})
                })

                it('alows update', async () => {
                    expect.assertions(1)

                    await this.service.update(this.code_id, {
                        text: 'updated'
                    })

                    const updated = await this.service.get(this.code_id)

                    expect(updated.text).toBe('updated')
                })

                it('allows remove', async () => {
                    expect.assertions(1)

                    await this.service.remove(this.code_id)

                    await this.service.get(this.code_id).catch(e => {
                        expect(e.code).toBe(404)
                    })
                })

                it('populates assignedBy', async () => {
                    const code = await this.service.get(this.code_id)
                    expect(code.assignedById).toBe(1)
                })
            });
        });

    });
});
