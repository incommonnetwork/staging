const app = require('../../server/app');

describe('\'reservations\' service', () => {
  it('registered the service', () => {
    const service = app.service('reservations');
    expect(service).toBeTruthy();
  });
});
