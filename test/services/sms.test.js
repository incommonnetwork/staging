const env = require('../setup.env.js')(4431);
const fetch = require('node-fetch');
const url = require('url');

describe('\'sms\' service', () => {
    beforeAll(env.before);
    afterAll(env.after);

    beforeEach(async () => {
        this.number = `+1${Math.floor(Math.random() * 1000000000)}`;
        this.code = this.number;
    });

    it('responds to create', async () => {
        expect.assertions(4);

        const result = await fetch(`${env.getApi('/sms')}`, {
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
        expect(result.ok).toBe(true);
        expect(result.status).toBe(201);
        expect(result.headers.get('content-type').indexOf('text/xml')).toBe(0);

        const body = await result.text();
        expect(body.indexOf('<Response><Message>')).toBeGreaterThan(-1);
    });

    it('does not throw on duplicate', async () => {
        expect.assertions(8);

        let i = 2;
        while (i--) {
            const result = await fetch(`${env.getApi('/sms')}`, {
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

            expect(result.ok).toBe(true);
            expect(result.status).toBe(201);
            expect(result.headers.get('content-type').indexOf('text/xml')).toBe(0);

            const body = await result.text();
            expect(body.indexOf('<Response><Message>')).toBeGreaterThan(-1);
        }
    });

    describe('no user', () => {

        describe('without code', async () => {

            beforeEach(async () => {
                this.result = await fetch(`${env.getApi('/sms')}`, {
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

                this.result_text = await this.result.text();
                this.message = this.result_text.split('<Message>').pop().split('</Message>')[0];
            });

            it('responds with error', () => {
                expect.assertions(1);

                expect(this.message.indexOf('Unrecognized')).toBe(0);
            });
        });

        describe('with code', async () => {

            beforeEach(async () => {
                this.api = await env.initApi();
                this.run = `${Math.random()}`;
                const strategy = 'local';
                // see server/services/seeders/20190530221359-mock-admin-user.js
                const email = 'admin@mock.admin';
                const password = 'admin123';

                this.creds = { strategy, email, password };

                await this.api.authenticate(this.creds);

                await this.api.service('codes').create({
                    text: this.run
                });

                this.result = await fetch(`${env.getApi('/sms')}`, {
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
                        body: this.run
                    })
                });

                this.result_text = await this.result.text();
                this.message = this.result_text.split('<Message>').pop().split('</Message>')[0];

            });

            it('responds with signup link', async () => {
                expect.assertions(1);
                /*eslint-disable no-console */
                console.log('MESSAGE', this.message)
                expect(this.message.indexOf(env.getPage('/sign_up'))).toBeGreaterThan(-1);
            });
        });

    });

    describe('with user', () => {
        beforeEach(async () => {
            this.run = `${Math.random()}`;

            await this.api.service('users').create({
                email: `${this.run}@example.com`,
                password: this.run,
                confirm_password: this.run,
                phoneId: 1
            });
        });

        describe('without code', () => {
            beforeEach(async () => {
                this.result = await fetch(`${env.getApi('/sms')}`, {
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

                this.result_text = await this.result.text();
                this.message = this.result_text.split('<Message>').pop().split('</Message>')[0];
            });

            it('responds with error', () => {
                expect.assertions(1);

                expect(this.message.indexOf('Unrecognized')).toBe(0);
            });
        });

        describe('with code', async () => {

            beforeEach(async () => {
                this.api = await env.initApi();
                this.run = `${Math.random()}`;
                const strategy = 'local';
                // see server/services/seeders/20190530221359-mock-admin-user.js
                const email = 'admin@mock.admin';
                const password = 'admin123';

                this.creds = { strategy, email, password };

                await this.api.authenticate(this.creds);

                await this.api.service('codes').create({
                    text: this.run
                });

                this.result = await fetch(`${env.getApi('/sms')}`, {
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
                        body: this.run
                    })
                });


                this.result_text = await this.result.text();
                this.message = this.result_text.split('<Message>').pop().split('</Message>')[0];
                const parts = this.message.split(' ');
                for (const word of parts) {
                    if (word.indexOf('http') === 0) {
                        const parsed = url.parse(word, true);
                        this.phone_id = parsed.query['amp;p'];
                    }
                }

                await this.api.service('users').create({
                    email: `${this.run}@example.com`,
                    password: this.run,
                    confirm_password: this.run,
                    phoneId: Number.parseInt(this.phone_id)
                });

                this.result = await fetch(`${env.getApi('/sms')}`, {
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
                        body: this.run
                    })
                });


                this.result_text = await this.result.text();
                this.message = this.result_text.split('<Message>').pop().split('</Message>')[0];


            });

            it('responds with success', async () => {
                expect.assertions(1);
                expect(this.message.indexOf('Successfully')).toBeGreaterThan(-1);
            });
        });
    });
});
