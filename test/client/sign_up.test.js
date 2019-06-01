/* global jasmine */
const puppeteer = require('puppeteer');
const env = require('../setup.env')(3032);
const getPage = env.getPage;

describe('/', () => {
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
        const form = await this.page.$('#sign_up_form');
        expect(form).toBeTruthy();
    });

});