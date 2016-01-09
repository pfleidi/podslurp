'use strict';

const assert = require('assert');
const supertest = require('supertest');

const helper = require('./test_helper');

describe('API', function () {
  var server = supertest.agent(helper.app);

  beforeEach(function (done) {
    helper.models.destroyAll().then(function () {
      done();
    });
  });

  describe('without downloaded files', function () {
    it('returns an empty files list', function (done) {
      server
      .get('/api/stats')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        count: 0,
        sentBytes: 0,
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
      .expect('Content-Type', /json/)
      .expect(200, {
        "count": 1,
        "sentBytes": 5242880,

        "files": [
          {
            "fileName": file,
            "count": 1,
            "sentBytes": 5242880
          }
        ]
      }, done);
    });
  });

  describe('with a partially downloaded file', function () {
    var file = '/testfile.img';

    beforeEach(function (done) {
      server
      .get(file)
      .set('Range', 'bytes=1000000-2000000')
      .expect(206, done);
    });

    it ('returns a valid files list', function (done) {
      server
      .get('/api/stats')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        "count": 1,
        "sentBytes": 1000001,

        "files": [
          {
            "fileName": file,
            "count": 1,
            "sentBytes": 1000001
          }
        ]
      }, done);
    });
  });

});
