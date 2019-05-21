const puppeteer = require('puppeteer')
const env = require('../setup.env')(3032)
const getPage = env.getPage

// Next.js does frontend routing; so we have to wait manually rather than listening to pageload events
const wait = (ms) => new Promise(res => setTimeout(res, ms))

const LinkSuite = (path, selector) => {
    describe(path, () => {
        beforeEach(async () => {
            this.link = await this.nav.$(selector)
        })

        afterEach(async () => {
            await this.link.dispose()
            this.link = null
        })

        it('link exists', async () => {
            expect.assertions(1)

            expect(this.link).toBeTruthy()
        })

        it('link clicks', async () => {
            await this.link.click()
        })

        it('link navigates', async () => {
            expect.assertions(1)
            await this.link.click()
            await wait(200)

            expect(await this.page.$eval('body', () => location.href)).toBe(getPage(path))
        })

        it('link navigates to reloadable page', async () => {
            expect.assertions(1)
            await this.link.click()
            await wait(100)

            const predivs = await this.page.$eval('div', (divs) => divs.length)

            await this.page.reload()
            await wait(200)

            const postdivs = await this.page.$eval('div', (divs) => divs.length)
            expect(predivs).toBe(postdivs)
        })

        it('link navigates to page with history', async () => {

            expect.assertions(1)

            const predivs = await this.page.$eval('div', (divs) => divs.length)

            await this.link.click()
            await wait(200)

            await this.page.goBack()

            const postdivs = await this.page.$eval('div', (divs) => divs.length).catch(e => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000
                while (1) { }
            })
            expect(predivs).toBe(postdivs)
        })
    })
}

// NavBar is present on several pages
const NavBar = (route, navmap) => {

    beforeEach(async () => {
        await this.page.goto(getPage(route))
        this.nav = await this.page.$('.navbar.is-primary')
    })

    afterEach(async () => {
        await this.nav.dispose()
        this.nav = null
    })

    it('exists', async () => {
        expect.assertions(1)
        expect(this.nav).toBeTruthy()
    })

    for (const path in navmap) {
        if (path === route) continue // ignore links to same page
        LinkSuite(path, navmap[path])
    }
}

const loggedOut = {
    '/': 'a#nav_',
    '/signup': 'a#nav_signup'
}

const routes = {
    '/': {
        navbar: loggedOut
    },
    '/signup': {
        navbar: loggedOut
    }
}

describe("Navigation", () => {
    beforeAll(async () => {
        await env.before()
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        this.browser = await puppeteer.launch({ headless: false })
    })

    afterAll(async () => {
        await env.after()
        await this.browser.close()
    })

    beforeEach(async () => {
        this.page = await this.browser.newPage()
    })

    afterEach(async () => {
        await this.page.close()
    })


    describe(`NavBar`, () => {
        for (const route in routes) {
            const { navbar } = routes[route]
            if (navbar) {
                describe(route, () => {
                    NavBar(route, navbar)
                })
            }
        }
    })
})