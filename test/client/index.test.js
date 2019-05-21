/* global location, jasmine */
const puppeteer = require('puppeteer');
const env = require('../setup.env')(3032);
const getPage = env.getPage;

const wait = (ms) => new Promise(res => setTimeout(res, ms));


const NavTest = (
    navmap
) => {
    describe('NavBar', () => {
        beforeEach(async () => {
            /*eslint-disable no-endef*/
            this.currentPath = await this.page.$eval('body', () => location.pathname);
            this.nav = await this.page.$('.navbar.is-primary');
        });

        it('exists', async () => {
            expect.assertions(1);
            expect(this.nav).toBeTruthy();
        });

        for (const path in navmap) {
            describe(path, () => {
                beforeEach(async () => {
                    this.link = await this.nav.$(navmap[path]);
                });

                it('link exists', async () => {
                    expect.assertions(1);

                    expect(this.link).toBeTruthy();
                });

                it('link clicks', async () => {
                    await this.link.click();
                });

                it('link navigates', async () => {
                    expect.assertions(1);
                    await this.link.click();
                    await wait(200);

                    expect(await this.page.$eval('body', () => location.href)).toBe(getPage(path));
                });

                it('link navigates to reloadable page', async () => {
                    expect.assertions(1);
                    await this.link.click();
                    await wait(100);

                    const predivs = await this.page.$eval('div', (divs) => divs.length);

                    await this.page.reload();

                    const postdivs = await this.page.$eval('div', (divs) => divs.length);
                    expect(predivs).toBe(postdivs);
                });

                it('link navigates to page with history', async () => {

                    expect.assertions(1);

                    const predivs = await this.page.$eval('div', (divs) => divs.length);

                    await this.link.click();
                    await wait(200);

                    await this.page.goBack();

                    const postdivs = await this.page.$eval('div', (divs) => divs.length);
                    expect(predivs).toBe(postdivs);
                });
            });
        }
    });

};


describe('/', () => {
    beforeAll(async () => {
        await env.before();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        this.browser = await puppeteer.launch();
    });

    afterAll(async () => {
        await env.after();
        await this.browser.close();
    });

    beforeEach(async () => {
        this.page = await this.browser.newPage();
        await this.page.goto(getPage('/'));
    });

    afterEach(async () => {
        await this.page.close();
    });

    it('loads', async () => {
        expect.assertions(1);
        const content = await this.page.content();
        expect(content.indexOf('<!DOCTYPE html')).toBe(0);
    });

    NavTest({
        '/signup': 'a#nav_signup'
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