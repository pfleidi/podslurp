const path = require('path');
const assert = require('assert');
const supertest = require('supertest');

const fixtureDir = path.join(__dirname, '..', 'fixtures');
const app = require('../../lib/server').start({ rootpath: fixtureDir });

describe('Downloads', function () {
  var server = supertest.agent(app);

  describe('With an invalid file path', function () {
    var file = '/invalidfile.mp3';

    it('returns file not found', function (done) {
      server
      .get(file)
      .expect(404, 'File not found: ' + file, done);
    });
  });

  describe('with a valid file path', function () {
    var file = '/testfile.img';

    it('returns the file', function (done) {
      server.get(file).expect(200, done);
    });
  });

});

