const puppeteer = require('puppeteer');
const env = require('../setup.env')(3035);
const getPage = env.getPage;

describe('/', () => {
    beforeAll(async () => {
        this.browser = await puppeteer.launch();
        await env.before();
    });

    afterAll(async () => {
        await env.after();
        await this.browser.close();
    });

    beforeEach(async () => {
        this.context = await this.browser.createIncognitoBrowserContext();
        this.page = await this.context.newPage();
        await this.page.goto(getPage('/'));
    });

    afterEach(async () => {
        await this.page.close();
        await this.context.close();
    });

    it('loads', async () => {
        expect.assertions(1);
        const content = await this.page.content();
        expect(content.indexOf('<!DOCTYPE html')).toBe(0);
    });

    it('contains a code form', async () => {
        await this.page.waitFor('#code_lookup_form');
    });
});