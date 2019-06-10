
const env = require('../setup.env.js')(4431);
const fetch = require('node-fetch');

describe('\'sms\' service', () => {
    beforeAll(env.before);
    afterAll(env.after);

    beforeEach(async () => {
        this.number = `+1${Math.floor(Math.random() * 1000000000)}`;
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

    it('should respond with a twilio xml definition', async () => {

    });
});
