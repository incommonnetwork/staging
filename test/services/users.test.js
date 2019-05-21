/* eslint-disable no-console */
const fetch = require('node-fetch');
const env = require('../setup.env.js')(3031);
const getApi = env.getApi;
const URL = getApi('users');
let rand = Math.random();

describe('\'users\' service', () => {
    beforeAll(env.before);

    afterAll(env.after);


    it('GET returns 401 unauthorized', async () => {
        expect.assertions(2);

        const res = await fetch(URL);

        expect(res.status).toBe(401);
        expect(res.statusText).toBe('Unauthorized');
    });

    describe('signup', () => {

        it('handles no email', async () => {
            expect.assertions(9);
            const signup = {};

            const err = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signup)
            }).catch(e => e);


            expect(err.status).toBe(400);
            expect(err.statusText).toBe('Bad Request');
            const json = await err.json();

            expect(json.errors).toHaveLength(2);
            expect(json.errors[0]).toBeInstanceOf(Object);
            expect(json.errors[0].type).toBe('notNull Violation');
            expect(json.errors[0].path).toBe('email');
            expect(json.errors[1]).toBeInstanceOf(Object);
            expect(json.errors[1].type).toBe('notNull Violation');
            expect(json.errors[1].path).toBe('password');
        });

        it('handles no password', async () => {
            expect.assertions(6);
            const signup = {
                email: `${rand}@example.com`
            };

            const err = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signup)
            }).catch(e => e);

            expect(err.status).toBe(400);
            expect(err.statusText).toBe('Bad Request');
            const json = await err.json();

            expect(json.errors).toHaveLength(1);
            expect(json.errors[0]).toBeInstanceOf(Object);
            expect(json.errors[0].type).toBe('notNull Violation');
            expect(json.errors[0].path).toBe('password');
        });

        it('handles invalid password type', async () => {
            expect.assertions(1);
            const signup = {
                email: `${rand}@example.com`,
                password: rand
            };

            const err = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signup)
            }).catch(e => e);

            expect(err.status).toBe(500);
        });

        it('handles create', async () => {
            expect.assertions(1);
            const signup = {
                email: `${rand}@example.com`,
                password: `${rand}`
            };

            const err = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signup)
            }).catch(e => e);

            expect(err.status).toBe(201);

        });

        it('handles duplicate create', async () => {
            expect.assertions(5);
            const signup = {
                email: `${rand}@example.com`,
                password: `${rand}`
            };

            const err = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signup)
            }).catch(e => e);

            expect(err.status).toBe(400);

            const json = await err.json();
            expect(json.errors).toHaveLength(1);
            expect(json.errors[0]).toBeInstanceOf(Object);
            expect(json.errors[0].type).toBe('unique violation');
            expect(json.errors[0].path).toBe('email');
        });
    });
});
