'use strict';

const assert = require('assert');
const _ = require('lodash');

const statsExtractor = require('../../lib/stats_extractor');

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
    country: '?',
    raw_user_agent: 'unknown',
    parsed_user_agent: 'Other',
    raw_referrer: 'unknown',
    parsed_referrer: '?'
  };

  const exctractStatistics = statsExtractor(req, res);

  describe('without a user agent or a referrer', function () {
    it('returns a valid response object', function () {
      let stats = exctractStatistics('canceled', duration, sentBytes)
      console.dir(req);
      console.dir(stats);

      assert.deepEqual(stats, expectedStatsTemplate);
    });
  });

  describe('with a known user agent', function () {
    let userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36';

    before(function () {
      req.headers['user-agent'] = userAgent;
    });

    after(function () {
      req.headers['user-agent'] = null;
    });

    it('returns a valid response object', function () {
      let stats = exctractStatistics('canceled', duration, sentBytes)
      let expectedStats = _.merge(expectedStatsTemplate, {
        raw_user_agent: userAgent,
        parsed_user_agent: 'Chrome'
      });

      assert.deepEqual(stats, expectedStatsTemplate);
    });
  });

});
