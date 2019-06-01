/* global jasmine, location */
const puppeteer = require('puppeteer');
const env = require('../setup.env')(3032);
const getPage = env.getPage;

const wait = (ms) => new Promise(res => setTimeout(res, ms));

const attempt = async (fn, expected) => {
    const start = Date.now();
    let res = null;
    while ((Date.now() - start) < 10000) {
        await wait(100);
        res = await fn().catch(() => 'ERROR');
        if (res !== 'ERROR' && (!expected || (expected === res))) break;
    }

    if (res === 'ERROR') return fn();

    return res;
};


describe('/', () => {
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
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
            expect(pathname).toBe('/home');
        });

        it('prevents non-matching passwords', async () => {
            expect.assertions(3);

            await this.page.type('#root_email', this.good_input.email);
            await this.page.type('#root_password', this.good_input.password);
            await this.page.type('#root_confirm_password', 'haha');

            const submit_button = await this.form.$('button.is-primary');
            await submit_button.click();

            const error = await this.form.$('.errors')

            expect(error).toBeTruthy()

            const error_message = await this.form.$eval('.list-group-item', (el) => el.innerText)
            expect(error_message).toBe(`confirm_password: Passwords don't match`)

            const pathname = await this.page.$eval('body', () => location.pathname);
            expect(pathname).toBe('/sign_up');
        });
    });

});