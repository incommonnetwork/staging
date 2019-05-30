const app = require('../../server/app');

describe('\'roles\' service', () => {
  it('registered the service', () => {
    const service = app.service('roles');
    expect(service).toBeTruthy();
  });
});
