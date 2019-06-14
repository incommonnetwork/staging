const env = require('../setup.env.js')(4431);
const fetch = require('node-fetch');

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
                FromState: 'CO'
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
                    FromState: 'CO'
                })
            });

            expect(result.ok).toBe(true);
            expect(result.status).toBe(201);
            expect(result.headers.get('content-type').indexOf('text/xml')).toBe(0);

            const body = await result.text();
            expect(body.indexOf('<Response><Message>')).toBeGreaterThan(-1);
        }
    });

    describe('no user with number', () => {
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

        it('responds with signup link', async () => {
            expect.assertions(1);

            expect(this.result_text.indexOf(env.getPage('/sign_up'))).toBeGreaterThan(-1);
        });
    });


});
