/* global location */
const puppeteer = require('puppeteer');
const env = require('../setup.env')(3034);
const { getPage, getPathname } = env;
const fetch = require('node-fetch');

const wait = (ms) => new Promise(res => setTimeout(res, ms));

const attempt = async (fn, expected) => {
    const start = Date.now();
    let res = null;
    while ((Date.now() - start) < 20000) {
        await wait(100);
        res = await fn().catch(() => 'ERROR');
        if (res !== 'ERROR' && (!expected || (expected === res))) break;
    }

    if (res === 'ERROR') return fn();

    return res;
};


describe('/sign_up', () => {
    beforeAll(async () => {
        this.browser = await puppeteer.launch();
        await env.before();
    });

    afterAll(async () => {
        await env.after();
        await this.browser.close();
    });

    beforeEach(async () => {
        this.page = await this.browser.newPage();
        await this.page.goto(getPage('/sign_up'));
    });

    afterEach(async () => {
        await this.page.close();
    });

    it('loads', async () => {
        expect.assertions(1);
        const content = await this.page.content();
        expect(content.indexOf('<!DOCTYPE html')).toBe(0);
    });

    it('has signup form', async () => {
        expect.assertions(1);
        const form = await this.page.$('#sign_up_form');
        expect(form).toBeTruthy();
    });

    describe('signup form', () => {
        beforeEach(async () => {
            this.form = await this.page.$('#sign_up_form');
            const rand = `${Math.random()}`;
            this.good_input = {
                email: `${rand}@test.com`,
                password: rand,
                confirm_password: rand,
            };
        });

        afterEach(async () => {
            await this.form.dispose();
        });

        it('accepts input', async () => {
            await this.page.type('#root_email', this.good_input.email);
            await this.page.type('#root_password', this.good_input.password);
            await this.page.type('#root_confirm_password', this.good_input.confirm_password);
        });

        it('registers succesfully', async () => {
            expect.assertions(1);

            await this.page.type('#root_email', this.good_input.email);
            await this.page.type('#root_password', this.good_input.password);
            await this.page.type('#root_confirm_password', this.good_input.confirm_password);

            const submit_button = await this.form.$('button.is-primary');
            await submit_button.click();

            const pathname = await attempt(() => this.page.$eval('body', () => location.pathname), '/home');
            expect(pathname).toBe(getPathname('/home'));
        });

        it('prevents non-matching passwords', async () => {
            expect.assertions(3);

            await this.page.type('#root_email', this.good_input.email);
            await this.page.type('#root_password', this.good_input.password);
            await this.page.type('#root_confirm_password', 'haha');

            const submit_button = await this.form.$('button.is-primary');
            await submit_button.click();

            const error = await this.form.$('.errors');

            expect(error).toBeTruthy();

            const error_message = await this.form.$eval('.list-group-item', (el) => el.innerText);
            expect(error_message).toBe('confirm_password: Passwords don\'t match');

            const pathname = await this.page.$eval('body', () => location.pathname);
            expect(pathname).toBe(getPathname('/sign_up'));
        });

        describe('sms referal', () => {
            beforeEach(async () => {
                this.number = `+1${Math.floor(Math.random() * 1000000000)}`;
                this.code = this.number;
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
                        Body: this.run
                    })
                });

                this.result_text = await this.result.text();
                this.message = this.result_text.split('<Message>').pop().split('</Message>')[0];
                const parts = this.message.split(' ');
                for (const word of parts) {
                    if (word.indexOf('http') === 0) {
                        this.signup_url = word.replace('amp;', '');
                    }
                }
            });

            it('correct path and host', async () => {
                expect.assertions(1);

                const url_no_query = this.signup_url.split('?')[0];
                expect(url_no_query).toBe(env.getPage('/sign_up'));
            });

            it('has code and phone query', async () => {
                expect.assertions(2);

                function parseQuery(queryString) {
                    var query = {};
                    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
                    for (var i = 0; i < pairs.length; i++) {
                        var pair = pairs[i].split('=');
                        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
                    }
                    return query;
                }

                const queryString = this.signup_url.split('?').pop();
                const query = parseQuery(queryString);

                expect(query.p).toBeTruthy();
                expect(query.c).toBeTruthy();
            });

            describe('registration', () => {
                beforeEach(async () => {
                    await this.page.goto(this.signup_url)

                    await this.page.type('#root_email', this.good_input.email);
                    await this.page.type('#root_password', this.good_input.password);
                    await this.page.type('#root_confirm_password', this.good_input.confirm_password);

                    const submit_button = await this.form.$('button.is-primary');
                    await submit_button.click();
                    await this.page.waitFor(() => location.pathname = '/home')
                })

                it('has user', async () => {
                    const { data: [user] } = await this.api.find({
                        email: this.good_input.email
                    })

                    expect(user).toBeTruthy()
                })
            })
        });
    });

});