'use strict';

const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const _ = require('lodash');

const parseUserAgent = sinon.stub();

const statsExtractor = proxyquire('../../lib/stats_extractor', {
  './user_agent_parser': parseUserAgent
});

describe('statsExtractor', function () {
  const transferState = 'canceled';
  const sentBytes = 100;
  const duration = 1337;

  const req = { ip: '127.0.0.1', headers: {} };
  const res = { statusCode: 200 };

  const expectedStatsTemplate = {
    transfer_state: transferState,
    transferred_bytes: sentBytes,
    transfer_time: duration,
    response_code: res.statusCode,
    ip_address: req.ip,
    country: 'unknown',
    raw_user_agent: 'unknown',
    parsed_user_agent: 'Other',
    raw_referrer: 'unknown',
    parsed_referrer: 'unknown'
  };

  const exctractStatistics = statsExtractor(req, res);

  describe('without a user agent or a referrer', function () {
    beforeEach(function () {
      parseUserAgent.withArgs('unknown').returns('Other');
    });

    it('returns a valid response object', function () {
      let stats = exctractStatistics('canceled', duration, sentBytes);

      assert.deepEqual(stats, expectedStatsTemplate);
    });
  });

  describe('with a user agent', function () {
    let userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36';

    before(function () {
      req.headers['user-agent'] = userAgent;
    });

    after(function () {
      req.headers['user-agent'] = null;
    });

    beforeEach(function () {
      parseUserAgent.withArgs(userAgent).returns('Chrome');
    });

    it('returns a response with the correctly parsed user agent', function () {
      let stats = exctractStatistics('canceled', duration, sentBytes);

      let expectedStats = _.assign({}, expectedStatsTemplate, {
        raw_user_agent: userAgent,
        parsed_user_agent: 'Chrome'
      });

      assert.deepEqual(stats, expectedStats);
    });
  });

  describe('with a referrer', function () {
    let referrer = 'http://blog.binaergewitter.de/';

    before(function () {
      req.headers.referrer = referrer;
    });

    after(function () {
      req.headers.referrer = null;
    });

    it('returns a response with the correctly parsed user agent', function () {
      let stats = exctractStatistics('canceled', duration, sentBytes);

      let expectedStats = _.assign({}, expectedStatsTemplate, {
        raw_referrer: referrer,
        parsed_referrer: 'blog.binaergewitter.de'
      });

      assert.deepEqual(stats, expectedStats);
    });
  });

  describe('with a german IP address', function () {
    let ip = '193.99.144.80';

    before(function () {
      req.ip = ip;
    });

    after(function () {
      req.ip = '127.0.0.1';
    });

    it('returns a response with the correctly parsed user agent', function () {
      let stats = exctractStatistics('canceled', duration, sentBytes);

      let expectedStats = _.assign({}, expectedStatsTemplate, {
        ip_address: ip,
        country: 'DE'
      });

      assert.deepEqual(stats, expectedStats);
    });
  });

});
