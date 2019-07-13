/* global location */
const env = require('../setup.env.js')(5555);
const puppeteer = require('puppeteer');
const moment = require('moment');
// const wait = () => new Promise(res => setTimeout(res, 100));
const isProdStaging = ['production', 'staging'].indexOf(process.env.TEST_ENV) !== -1;

if (!isProdStaging) {
    describe('email hooks', () => {
        beforeAll(async () => {
            await env.before();
            this.browser = await puppeteer.launch();
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

            this.restaurant = await this.app.service('restaurants').create({
                name: this.rand,
                neighborhoodId: this.neighborhood.id,
                address: `123 ${this.rand}`,
                url: this.rand,
                map: this.rand
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
            this.user_creds.strategy = 'local';

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

        describe('invite', () => {
            beforeEach(async () => {
                this.registration = await this.app.service('registrations').create({
                    codeId: this.code.id,
                    neighborhoodId: this.neighborhood.id,
                    dates: this.code.dates
                });

                await this.app.authenticate(this.admin_creds);

                this.invite = await this.app.service('invites').create({
                    date: this.code.dates[0],
                    restaurantId: this.restaurant.id,
                    registrations: [this.registration.id]
                });
            });


            it('has email confirmation', async () => {
                expect.assertions(2);
                expect(this.invite.email_confirmations).toBeTruthy();

                for (const confirmation of this.invite.email_confirmations) {
                    await this.page.goto(confirmation);
                    await this.page.waitFor('.mp_address_email');
                    const sent_email = await this.page.$eval('.mp_address_email', (el) => el.getAttribute('title'));
                    expect(sent_email).toBe('noreply@bots.incommon.dev');
                }
            });

            it('contains link to rsvp', async () => {
                for (const confirmation of this.invite.email_confirmations) {
                    await this.page.goto(confirmation);
                    await this.page.waitFor('.mp_address_email');
                    const frameHandle = await this.page.waitFor('iframe');
                    const frame = await frameHandle.contentFrame();
                    await frame.waitFor(`a[href="${env.getPage('/rsvp')}?invite=${this.invite.id}"]`);
                }
            });

            describe('link to rsvp', async () => {
                beforeEach(async () => {
                    await this.page.goto(`${env.getPage('/rsvp')}?invite=${this.invite.id}`);
                });

                it('forces log in', async () => {
                    await this.page.waitFor((expected) => location.pathname === expected, {}, env.getPathname('/sign_in'));
                });

                it('redirects after login to rsvp', async () => {
                    await this.page.waitFor((expected) => location.pathname === expected, {}, env.getPathname('/sign_in'));
                    await this.page.type('#root_email', this.user_creds.email);
                    await this.page.type('#root_password', this.user_creds.password);
                    const submit_button = await this.page.$('button.is-primary');
                    await submit_button.click();
                    await this.page.waitFor((expected) => location.pathname === expected, {}, env.getPathname('/rsvp'));
                });
            });
        });

        describe('rsvp', () => {
            beforeEach(async () => {
                this.registration = await this.app.service('registrations').create({
                    codeId: this.code.id,
                    neighborhoodId: this.neighborhood.id,
                    dates: this.code.dates
                });

                await this.app.authenticate(this.admin_creds);

                this.invite = await this.app.service('invites').create({
                    date: this.code.dates[0],
                    restaurantId: this.restaurant.id,
                    registrations: [this.registration.id]
                });

                await this.app.authenticate(this.user_creds);

                this.rsvp = await this.app.service('rsvps').create({
                    inviteId: this.invite.id,
                    accepted: true,
                    total: 1,
                });
            });


            it('has email confirmation', async () => {
                expect.assertions(2);
                expect(this.rsvp.email_confirmation).toBeTruthy();

                await this.page.goto(this.rsvp.email_confirmation);
                await this.page.waitFor('.mp_address_email');
                const sent_email = await this.page.$eval('.mp_address_email', (el) => el.getAttribute('title'));
                expect(sent_email).toBe('noreply@bots.incommon.dev');
            });
        });


        describe('reservations', () => {
            beforeEach(async () => {
                this.registration = await this.app.service('registrations').create({
                    codeId: this.code.id,
                    neighborhoodId: this.neighborhood.id,
                    dates: this.code.dates
                });

                await this.app.authenticate(this.admin_creds);

                this.invite = await this.app.service('invites').create({
                    date: this.code.dates[0],
                    restaurantId: this.restaurant.id,
                    registrations: [this.registration.id]
                });

                await this.app.authenticate(this.user_creds);

                this.rsvp = await this.app.service('rsvps').create({
                    inviteId: this.invite.id,
                    accepted: true,
                    total: 1,
                });

                await this.app.authenticate(this.admin_creds);

                this.reservation = await this.app.service('reservations').create({
                    inviteId: this.invite.id,
                    restaurantId: this.restaurant.id,
                    date: this.code.dates[0]
                });
            });


            it('has email confirmation', async () => {
                expect.assertions(2);
                expect(this.reservation.email_confirmations).toBeTruthy();

                for (const confirmation of this.reservation.email_confirmations) {
                    await this.page.goto(confirmation);
                    await this.page.waitFor('.mp_address_email');
                    const sent_email = await this.page.$eval('.mp_address_email', (el) => el.getAttribute('title'));
                    expect(sent_email).toBe('noreply@bots.incommon.dev');
                }
            });
        });
    });
}