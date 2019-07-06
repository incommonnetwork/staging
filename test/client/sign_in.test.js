/* global location */
const puppeteer = require('puppeteer');
const env = require('../setup.env')(4032);
const { getPage, getPathname } = env;


describe('/sign_in', () => {
    beforeAll(async () => {
        this.browser = await puppeteer.launch();
        this.context = await this.browser.createIncognitoBrowserContext();
        await env.before();
    });

    afterAll(async () => {
        await env.after();
        await this.context.close();
        await this.browser.close();
    });

    beforeEach(async () => {
        this.app = await env.initApi();
        this.page = await this.context.newPage();
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

    describe('signin form', () => {
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
            await this.page.type('#root_email', this.good_input.email);
            await this.page.type('#root_password', this.good_input.password);

            const submit_button = await this.form.$('button.is-primary');
            await submit_button.click();

            await this.page.waitFor((pathname) => pathname === location.pathname, { timeout: 60000 }, getPathname('/home'));
        });

        it('errors on bad password', async () => {
            expect.assertions(0);

            await this.page.type('#root_email', this.good_input.email);
            await this.page.type('#root_password', 'wrong password');

            const submit_button = await this.form.$('button.is-primary');
            await submit_button.click();

            await this.page.waitFor('#sign_in_error', {});
        });

        it('changes navbar to sign out when signed in', async () => {

            await this.page.type('#root_email', this.good_input.email);
            await this.page.type('#root_password', this.good_input.password);

            const submit_button = await this.form.$('button.is-primary');
            await submit_button.click();
            await this.page.waitFor('#sign_out_nav', {});
        });

        it('signs out', async () => {
            await this.page.type('#root_email', this.good_input.email);
            await this.page.type('#root_password', this.good_input.password);

            const submit_button = await this.form.$('button.is-primary');
            await submit_button.click();
            await this.page.waitFor('#sign_out_nav', {});

            const sign_out_button = await this.page.$('#sign_out_nav');
            await sign_out_button.click();
            await this.page.waitFor('#sign_in_nav', {});
            await this.page.waitFor(pathname => location.pathname === pathname, { timeout: 60000 }, getPathname('/'));
        });

        it('respects redirects', async () => {
            await this.form.dispose();
            await this.page.goto(`${getPage('/sign_in')}?redirect=${getPathname('/states')}`);
            await this.page.waitFor('#sign_in_form')
            this.form = await this.page.$('#sign_in_form');

            await this.page.type('#root_email', this.good_input.email);
            await this.page.type('#root_password', this.good_input.password);

            const submit_button = await this.form.$('button.is-primary');
            await submit_button.click();
            await this.page.waitFor((expected) => location.pathname === expected, { timeout: 60000 }, getPathname('/states'));
        });

        it('redirects with user parameter', async () => {

            await this.page.type('#root_email', this.good_input.email);
            await this.page.type('#root_password', this.good_input.password);

            const submit_button = await this.form.$('button.is-primary');
            await submit_button.click();
            await this.page.waitFor((expected) => location.href.indexOf(expected) === 0, { timeout: 60000 }, `${getPage('/home')}?user=`);
        });
    });

});