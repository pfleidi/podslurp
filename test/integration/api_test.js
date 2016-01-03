const path = require('path');
const assert = require('assert');
const supertest = require('supertest');

const fixtureDir = path.join(__dirname, '..', 'fixtures');
const app = require('../../lib/server').start({ rootpath: fixtureDir });

describe('API', function () {
  var server = supertest.agent(app);

  describe('without downloaded files', function () {
    it('returns an empty files list', function (done) {
      server
      .get('/api/stats')
      .set('Accept', 'application/json')
      .expect(200, {
        files: []
      }, done);
    });
  });

  describe('with a successfully downloaded file', function () {
    var file = '/testfile.img';

    beforeEach(function (done) {
      server.get(file).expect(200, done);
    });

    it ('returns a valid files list', function (done) {
      server
      .get('/api/stats')
      .set('Accept', 'application/json')
      .expect(200, {
        "files": [
          {
            "fileName": file,
            "stats": {
              "complete": 1,
              "sentBytes": 5242880
            }
          }
        ]
      }, done);
    });
  });

});
