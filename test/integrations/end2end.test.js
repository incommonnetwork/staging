/* global location */
const env = require('../setup.env.js')(5555);
const puppeteer = require('puppeteer');
const moment = require('moment');
const fetch = require('node-fetch');
// const wait = () => new Promise(res => setTimeout(res, 100));
const isProdStaging = ['production', 'staging'].indexOf(process.env.TEST_ENV) !== -1;

if (!isProdStaging) {
    describe('create users', () => {
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

            this.users = [];
            for (const id of [1]) {
                const user = await this.app.service('users').create({
                    email: `${id}${this.rand}@e2e.test`,
                    password: this.rand
                });
                this.users.push({
                    password: this.rand,
                    strategy: 'local',
                    ...user,
                });
            }

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
                map: `https://${this.rand}.com`
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


            const result = await fetch(`${env.getApi('/sms')}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    From: `+1${Math.floor(Math.random() * 1000000000)}`,
                    FromCity: 'BOULDER',
                    FromZip: '80301',
                    FromCountry: 'UNITED STATES',
                    FromState: 'CO',
                    Body: this.code.text
                })
            });


            const result_text = await result.text();
            const message = result_text.split('<Message>').pop().split('</Message>')[0];
            const parts = message.split(' ');
            for (const word of parts) {
                if (word.indexOf('http') === 0) {
                    this.sms_url = word.replace('amp;', '');
                }
            }
            this.context = await this.browser.createIncognitoBrowserContext();
            this.page = await this.context.newPage();
            //this.page.setDefaultTimeout(3000);
        });

        afterEach(async () => {
            await this.page.close();
            await this.context.close();
        });

        it('navigates to sign_up without logged in', async () => {
            await this.page.goto(this.sms_url);
            await this.page.waitFor((expected) => location.pathname === expected, {}, env.getPathname('/sign_up'));
        });

        it('navigates to register after sign up', async () => {
            await this.page.goto(this.sms_url);
            await this.page.waitFor('#root_email');

            await this.page.type('#root_email', `create${this.users[0].email}`);
            await this.page.type('#root_password', this.users[0].password);
            await this.page.type('#root_confirm_password', this.users[0].password);

            const submit_button = await this.page.waitFor('button.is-primary');
            await submit_button.click();
            await this.page.waitFor(expected => location.pathname === expected, {}, env.getPathname('/register'));
        });

        it('navigates to register if logged in', async () => {
            await this.page.goto(env.getPage('sign_in'));
            await this.page.waitFor('#root_email');
            await this.page.type('#root_email', this.users[0].email);
            await this.page.type('#root_password', this.users[0].password);

            const submit_button = await this.page.waitFor('button.is-primary');
            await submit_button.click();
            await this.page.waitFor(expected => location.pathname === expected, {}, env.getPathname('/home'));
            await this.page.goto(this.sms_url);
            await this.page.waitFor(expected => location.href === expected, {}, this.sms_url);
        });

        describe('register', () => {
            beforeEach(async () => {
                await this.page.goto(env.getPage('sign_in'));
                await this.page.waitFor('#root_email');
                await this.page.type('#root_email', this.users[0].email);
                await this.page.type('#root_password', this.users[0].password);

                const submit_button = await this.page.waitFor('button.is-primary');
                await submit_button.click();
                await this.page.waitFor(expected => location.pathname === expected, {}, env.getPathname('/home'));
                await this.page.goto(this.sms_url);
                await this.page.waitFor(expected => location.href === expected, {}, this.sms_url);
            });

            it('accepts registration', async () => {
                await this.page.waitFor('#root_neighborhood');
                await this.page.select('#root_neighborhood', `${this.neighborhood.id}`);
                const firstDate = await this.page.waitFor('#root_dates_0');
                await firstDate.click();
                const submit_button = await this.page.waitFor('button.is-primary');
                await submit_button.click();
                await this.page.waitFor(expected => location.pathname === expected, {}, env.getPathname('/thank_you_register'));
            });

            describe('invite', () => {
                beforeEach(async () => {
                    await this.page.waitFor('#root_neighborhood');
                    await this.page.select('#root_neighborhood', `${this.neighborhood.id}`);
                    const firstDate = await this.page.waitFor('#root_dates_0');
                    await firstDate.click();
                    const submit_button = await this.page.waitFor('button.is-primary');
                    await submit_button.click();
                    await this.page.waitFor(expected => location.pathname === expected, {}, env.getPathname('/thank_you_register'));

                    const logout = await this.page.waitFor('#sign_out_nav');
                    await logout.click();
                    await this.page.waitFor(expected => location.pathname === expected, {}, env.getPathname('/'));
                    await this.page.goto(env.getPage('/admin'));
                    await this.page.waitFor('#root_email');

                    await this.page.type('#root_email', this.admin_creds.email);
                    await this.page.type('#root_password', this.admin_creds.password);
                    const submit_button_2 = await this.page.waitFor('button.is-primary');
                    await submit_button_2.click();
                    await this.page.waitFor(expected => location.pathname === expected, {}, env.getPathname('/admin'));
                });

                // it.only('renders invite create form', async () => {
                //     const inviteTab = await this.page.waitFor('#invites_tab');
                //     await inviteTab.click();
                //     const createButton = await this.page.waitFor('#invites_modal');
                //     await createButton.click();
                //     const openModal = await this.page.waitFor('#invites_modal_open');
                //     await openModal.click();

                //     //TODO: invites generator is super inneficient with test data
                //     await this.page.waitFor('#root_anyof_select', { timeout: 300000 });
                // });

                describe('rsvp', () => {
                    beforeEach(async () => {

                        await this.page.goto(env.getPage('sign_in'));
                        await this.page.waitFor('#root_email');
                        await this.page.type('#root_email', this.users[0].email);
                        await this.page.type('#root_password', this.users[0].password);
                        const submit_button = await this.page.waitFor('button.is-primary');
                        await submit_button.click();
                        await this.page.waitFor(expected => location.pathname === expected, {}, env.getPathname('/home'));

                        await this.app.authenticate(this.admin_creds);
                        const registrations = await this.app.service('registrations').find({
                            query: {
                                codeId: this.code.id
                            }
                        });

                        this.invite = await this.app.service('invites').create({
                            date: this.code.dates[0],
                            restaurantId: this.restaurant.id,
                            registrations: registrations.data.map(({ id }) => id)
                        });
                    });

                    it('shows rsvp', async () => {
                        await this.page.goto(env.getPage('/rsvp') + `?invite=${this.invite.id}`);
                        await this.page.waitFor('#root_total');
                    });

                    it('has map modal', async () => {
                        await this.page.goto(env.getPage('/rsvp') + `?invite=${this.invite.id}`);
                        await this.page.waitFor('#restaurant_map_modal');
                    });

                    it('accepts rsvp and redirects to thankyou', async () => {
                        await this.page.goto(env.getPage('/rsvp') + `?invite=${this.invite.id}`);
                        const button = await this.page.waitFor('button.is-primary');
                        await button.click();
                        await this.page.waitFor(expected => location.pathname === expected, {}, env.getPathname('/thank_you_rsvp'));
                    });

                    it('redirects to thankyou after duplicate rsvp', async () => {
                        await this.page.goto(env.getPage('/rsvp') + `?invite=${this.invite.id}`);
                        const button = await this.page.waitFor('button.is-primary');
                        await button.click();
                        await this.page.waitFor(expected => location.pathname === expected, {}, env.getPathname('/thank_you_rsvp'));

                        await this.page.goto(env.getPage('/rsvp') + `?invite=${this.invite.id}`);
                        await this.page.waitFor(expected => location.pathname === expected, {}, env.getPathname('/thank_you_rsvp'));
                    });

                    describe('reservation', () => {
                        beforeEach(async () => {
                            await this.page.goto(env.getPage('/rsvp') + `?invite=${this.invite.id}`);
                            const button = await this.page.waitFor('button.is-primary');
                            await button.click();
                            await this.page.waitFor(expected => location.pathname === expected, {}, env.getPathname('/thank_you_rsvp'));
                            await this.app.authenticate(this.admin_creds);
                            this.reservation = await this.app.service('reservations').create({
                                inviteId: this.invite.id,
                                restaurantId: this.restaurant.id,
                                date: this.code.dates[0]
                            });
                        });

                        it('has confirmation screen', async () => {
                            await this.page.goto(`${env.getPage('/reservation_confirmation')}?id=${this.reservation.id}`);
                            await this.page.waitFor(expected => location.pathname === expected, {}, env.getPathname('/reservation_confirmation'));
                        });
                    });
                });
            });
        });


    });
} else {
    describe('skip test', () => {
        it('skipped', () => { });
    });
}