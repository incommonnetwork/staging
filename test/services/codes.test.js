const app = require('../../server/app');

describe('\'codes\' service', () => {
    it('registered the service', () => {
        const service = app.service('codes');
        expect(service).toBeTruthy();
    });
});
