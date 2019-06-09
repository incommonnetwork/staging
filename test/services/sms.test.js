const app = require('../../server/app');

describe('\'sms\' service', () => {
    it('registered the service', () => {
        const service = app.service('sms');
        expect(service).toBeTruthy();
    });
});
