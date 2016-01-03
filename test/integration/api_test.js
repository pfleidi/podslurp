'use strict';

const path = require('path');
const assert = require('assert');
const supertest = require('supertest');

const fixtureDir = path.join(__dirname, '..', 'fixtures');

describe('API', function () {
  var app;
  var server;

  beforeEach(function () {
    app = require('../../lib/server').start({ rootpath: fixtureDir });
    server = supertest.agent(app);
  });

  describe('without downloaded files', function () {
    it('returns an empty files list', function (done) {
      server
      .get('/api/stats')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
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
      .expect('Content-Type', /json/)
      .expect(200, {
        "files": [
          {
            "fileName": file,
            "sentBytes": 5242880,
            "incompleteDownloads" : {
              "count": 0,
              "userAgents": {}
            },
            "completeDownloads": {
              "count": 1,
              "userAgents": {
                "Other": 1
              }
            }
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
        "files": [
          {
            "fileName": file,
            "sentBytes": 1000001,
            "incompleteDownloads" : {
              "count": 1,
              "userAgents": {
                "Other": 1
              }
            },
            "completeDownloads": {
              "count": 0,
              "userAgents": {}
            }
          }
        ]
      }, done);
    });
  });

});
