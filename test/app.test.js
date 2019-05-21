const rp = require('request-promise-native');
const env = require('./setup.env')(3030);
const getUrl = env.getUrl;

describe('Feathers application tests (with jest)', () => {
  beforeAll(env.before);

  afterAll(env.after);

  it('starts and shows the index page' + getUrl(), () => {
    expect.assertions(1);
    return rp(getUrl()).then(
      body => expect(body.indexOf('<html>')).not.toBe(-1)
    );
  });

  describe('404', () => {
    it('shows a 404 HTML page', () => {
      expect.assertions(2);
      return rp({
        url: getUrl('path/to/nowhere'),
        headers: {
          'Accept': 'text/html'
        }
      }).catch(res => {
        expect(res.statusCode).toBe(404);
        expect(res.error.indexOf('<html>')).not.toBe(-1);
      });
    });

    it('shows a 404 JSON error without stack trace', () => {
      expect.assertions(4);
      return rp({
        url: getUrl('path/to/nowhere'),
        json: true
      }).catch(res => {
        expect(res.statusCode).toBe(404);
        expect(res.error.code).toBe(404);
        expect(res.error.message).toBe('Page not found');
        expect(res.error.name).toBe('NotFound');
      });
    });
  });
});
