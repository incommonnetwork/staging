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
});