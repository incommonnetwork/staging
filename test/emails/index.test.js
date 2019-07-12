
const env = require('../setup.env.js')(5555);
const puppeteer = require('puppeteer');
const moment = require('moment');
// const wait = () => new Promise(res => setTimeout(res, 100));
const isProdStaging = ['production', 'staging'].indexOf(process.env.TEST_ENV) !== -1;

if (!isProdStaging) {
    describe('email hooks', () => {
        beforeAll(async () => {
            await env.before();
            this.browser = await puppeteer.launch({ headless: false });
        });

        afterAll(async () => {
            await this.browser.close();
            await env.after();
        });

        beforeEach(async () => {
            this.admin_creds = {
                strategy: 'local',
                email: 'admin@mock.admin',
                password: 'admin123'
            };
            this.rand = `${Math.random()}`;

            this.app = await env.initApi();
            await this.app.authenticate(this.admin_creds);

            this.city = await this.app.service('cities').create({
                city: this.rand,
                state: this.rand,
                country: this.rand,
                latitude: 10,
                longitude: 10
            });

            this.neighborhood = await this.app.service('neighborhoods').create({
                neighborhood: this.rand,
                area: this.rand,
                latitude: 10,
                longitude: 10,
                cityId: this.city.id
            });

            this.code = await this.app.service('codes').create({
                text: this.rand,
                cityId: this.city.id,
                dates: [
                    moment().add(1, 'days').format('YYYY[/]MM[/]D'),
                    moment().add(2, 'days').format('YYYY[/]MM[/]D'),
                    moment().add(3, 'days').format('YYYY[/]MM[/]D')
                ]
            });

            this.context = await this.browser.createIncognitoBrowserContext();
            this.page = await this.context.newPage();
            this.user_creds = {
                email: `${this.rand}@test.com`,
                password: this.rand
            };

            this.user = await this.app.service('users').create(this.user_creds);
            await this.app.authenticate({
                strategy: 'local',
                ...this.user_creds
            });
        });

        afterEach(async () => {
            await this.page.close();
            await this.context.close();
        });

        describe('sign_up', () => {
            it('has email confirmation', async () => {
                expect.assertions(2);
                expect(this.user.email_confirmation).toBeTruthy();

                await this.page.goto(this.user.email_confirmation);
                await this.page.waitFor('.mp_address_email');
                const sent_email = await this.page.$eval('.mp_address_email', (el) => el.getAttribute('title'));
                expect(sent_email).toBe('noreply@bots.incommon.dev');
            });
        });

        describe('register', () => {
            beforeEach(async () => {
                this.registration = await this.app.service('registrations').create({
                    codeId: this.code.id,
                    neighborhoodId: this.neighborhood.id,
                    dates: this.code.dates
                });
            });


            it('has email confirmation', async () => {
                expect.assertions(2);
                expect(this.registration.email_confirmation).toBeTruthy();

                await this.page.goto(this.registration.email_confirmation);
                await this.page.waitFor('.mp_address_email');
                const sent_email = await this.page.$eval('.mp_address_email', (el) => el.getAttribute('title'));
                expect(sent_email).toBe('noreply@bots.incommon.dev');
            });
        });
    });
}