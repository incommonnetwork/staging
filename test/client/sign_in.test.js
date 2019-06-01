/* global location */
const puppeteer = require('puppeteer');
const env = require('../setup.env')(3032);
const { getPage, getPathname } = env;

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


describe('/sign_in', () => {
    beforeAll(async () => {
        this.browser = await puppeteer.launch();
        await env.before();
    });

    afterAll(async () => {
        await env.after();
        await this.browser.close();
    });

    beforeEach(async () => {
        this.app = await env.initApi();
        this.page = await this.browser.newPage();
        await this.page.goto(getPage('/sign_in'));
    });

    afterEach(async () => {
        this.app = null;
        await this.page.close();
    });

    it('loads', async () => {
        expect.assertions(1);
        const content = await this.page.content();
        expect(content.indexOf('<!DOCTYPE html')).toBe(0);
    });

    it('has signin form', async () => {
        expect.assertions(1);
        const form = await this.page.$('#sign_in_form');
        expect(form).toBeTruthy();
    });

    describe('signup form', () => {
        beforeEach(async () => {
            this.form = await this.page.$('#sign_in_form');
            const rand = `${Math.random()}`;
            this.good_input = {
                email: `${rand}@test.com`,
                password: rand,
                confirm_password: rand,
            };

            await this.app.service('users').create(this.good_input);
        });

        afterEach(async () => {
            await this.form.dispose();
        });

        it('accepts input', async () => {
            await this.page.type('#root_email', this.good_input.email);
            await this.page.type('#root_password', this.good_input.password);
        });

        it('logs in succesfully', async () => {
            expect.assertions(1);

            await this.page.type('#root_email', this.good_input.email);
            await this.page.type('#root_password', this.good_input.password);

            const submit_button = await this.form.$('button.is-primary');
            await submit_button.click();

            const pathname = await attempt(() => this.page.$eval('body', () => location.pathname), '/home');
            expect(pathname).toBe(getPathname('/home'));
        });

        it('errors on bad password', async () => {
            expect.assertions(0);

            await this.page.type('#root_email', this.good_input.email);
            await this.page.type('#root_password', 'wrong password');

            const submit_button = await this.form.$('button.is-primary');
            await submit_button.click();

            await this.page.waitFor('#sign_in_error', { timeout: 5000 });
        });
    });

});