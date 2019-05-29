/* global jasmine, location */

const puppeteer = require('puppeteer');
const env = require('../setup.env')(3032);
const getPage = env.getPage;

// Next.js does frontend routing; so we have to wait manually rather than listening to pageload events
const wait = (ms) => new Promise(res => setTimeout(res, ms));

const attempt = async (fn, expected) => {
    const start = Date.now()
    let res = null
    while ((Date.now() - start) < 5000) {
        res = await fn()
        if (res === expected) break;
        await wait(100)
    }

    expect(res).toBe(expected)
}

const LinkSuite = (path, selector) => {
    describe(path, () => {
        beforeEach(async () => {
            this.link = await this.nav.$(selector);
        });

        afterEach(async () => {
            await this.link.dispose();
            this.link = null;
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

            await attempt(() => this.page.$eval('body', () => location.href), getPage(path))
        });

        it('link navigates to reloadable page', async () => {
            expect.assertions(1);
            await this.link.click();
            await wait(2000);

            const predivs = await this.page.$eval('div', (divs) => divs.length);

            await this.page.reload();
            await attempt(() => this.page.$eval('div', (divs) => divs.length), predivs)
        });

        it('link navigates to page with history', async () => {

            expect.assertions(1);

            const predivs = await this.page.$eval('div', (divs) => divs.length);

            await this.link.click();
            await wait(2000);

            await this.page.goBack();

            await attempt(() => this.page.$eval('div', (divs) => divs.length), predivs)
        });
    });
};

// NavBar is present on several pages
const NavBar = (route, navmap) => {

    beforeEach(async () => {
        await this.page.goto(getPage(route));
        this.nav = await this.page.$('.navbar.is-primary');
    });

    afterEach(async () => {
        await this.nav.dispose();
        this.nav = null;
    });

    it('exists', async () => {
        expect.assertions(1);
        expect(this.nav).toBeTruthy();
    });

    for (const path in navmap) {
        if (path === route) continue; // ignore links to same page
        LinkSuite(path, navmap[path]);
    }
};

const loggedOut = {
    '/': '#nav_',
    '/sign_up': '#nav_signup'
};

const routes = {
    '/': {
        navbar: loggedOut
    },
    '/sign_up': {
        navbar: loggedOut
    }
};

describe('Navigation', () => {
    beforeAll(async () => {
        await env.before();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
        this.browser = await puppeteer.launch();
    });

    afterAll(async () => {
        await env.after();
        await this.browser.close();
    });

    beforeEach(async () => {
        this.page = await this.browser.newPage();
    });

    afterEach(async () => {
        await this.page.close();
    });


    describe('NavBar', () => {
        for (const route in routes) {
            const { navbar } = routes[route];
            if (navbar) {
                describe(route, () => {
                    NavBar(route, navbar);
                });
            }
        }
    });
});