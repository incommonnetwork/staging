const puppeteer = require('puppeteer');
const env = require('../setup.env')(3033);
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
        this.page = await this.browser.newPage();
        await this.page.goto(getPage('/about'));
    });

    afterEach(async () => {
        await this.page.close();
    });

    it('loads', async () => {
        expect.assertions(1);
        const content = await this.page.content();
        expect(content.indexOf('<!DOCTYPE html')).toBe(0);
    });

    it('contains an iframe to spark', async () => {
        expect.assertions(4);

        const iframe = await this.page.$eval('#spark', (spark) => spark.tagName);
        expect(iframe).toBeTruthy();
        expect(iframe).toBe('IFRAME');

        const src = await this.page.$eval('#spark', spark => spark.src);
        expect(src).toBeTruthy();
        expect(src).toBe('https://spark.adobe.com/page/oFoZUUzRZITY1/');
    });
});