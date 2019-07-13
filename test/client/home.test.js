/* global location */
const puppeteer = require('puppeteer');
const env = require('../setup.env')(5032);
const { getPage, getPathname } = env;


describe('/home', () => {
    beforeAll(async () => {
        this.browser = await puppeteer.launch({});
        await env.before();
    });

    afterAll(async () => {
        await env.after();
        await this.browser.close();
    });

    beforeEach(async () => {
        this.context = await this.browser.createIncognitoBrowserContext();
        this.app = await env.initApi();
        this.page = await this.context.newPage();
        await this.page.goto(getPage('/home'));
    });

    afterEach(async () => {
        await this.page.close();
        await this.context.close();
        this.app = null;
    });

    it('loads', async () => {
        expect.assertions(1);
        const content = await this.page.content();
        expect(content.indexOf('<!DOCTYPE html')).toBe(0);
    });

    it('redirects to sign in', async () => {
        await this.page.waitFor((pathname) => pathname === location.pathname, { timeout: 60000 }, getPathname('/sign_in'));
    });

    describe('tabs', () => {
        beforeEach(async () => {
            await this.page.waitFor((pathname) => pathname === location.pathname, { timeout: 60000 }, getPathname('/sign_in'));
            const form = await this.page.waitFor('#sign_in_form');
            const rand = `${Math.random()}`;
            const good_input = {
                email: `${rand}@test.com`,
                password: rand,
                confirm_password: rand,
            };

            await this.app.service('users').create(good_input);

            await this.page.type('#root_email', good_input.email);
            await this.page.type('#root_password', good_input.password);

            const submit_button = await form.$('button.is-primary');
            await submit_button.click();

            await this.page.waitFor((pathname) => pathname === location.pathname, { timeout: 60000 }, getPathname('/home'));
        });

        it('has tabs', async () => {
            await this.page.waitFor('#home_tabs', {});
        });

        describe('settings', async () => {
            it('has tab', async () => {
                await this.page.waitFor('#settings_tab', {});
            });

            it('has tab content', async () => {
                await this.page.waitFor('#settings_tab_content', {});
            });

            it('has form', async () => {
                await this.page.waitFor('#settings_form');
            });
        });
    });

});