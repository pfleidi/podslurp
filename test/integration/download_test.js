'use strict';

const assert = require('assert');
const supertest = require('supertest');

const helper = require('./test_helper');
const app = helper.app;

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
    var file = '/silence.m4a';

    it('returns the file', function (done) {
      server.get(file)
      .expect('Content-Type', 'audio/mp4')
      .expect(200, done);
    });
  });

  describe('with a range request', function () {
    var file = '/testfile.img';

    it('returns the file', function (done) {
      server
      .get(file)
      .set('Range', 'bytes=1000000-2000000')
      .expect('Content-Length', '1000001')
      .expect('Content-Type', 'application/octet-stream')
      .expect(206, done);
    });
  });

});

