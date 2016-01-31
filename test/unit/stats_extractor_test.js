'use strict';

const assert = require('assert');
const _ = require('lodash');

const statsExtractor = require('../../lib/stats_extractor');

describe('statsExtractor', function () {
  const transferState = 'canceled';
  const sentBytes = 100;
  const duration = 1337;

  const headers = {};
  const req = { ip: '127.0.0.1', headers: headers };
  const res = { statusCode: 200 };

  const expectedStatsTemplate = {
    transfer_state: transferState,
    transferred_bytes: sentBytes,
    transfer_time: duration,
    response_code: res.statusCode,
    ip_address: req.ip,
    country: '?',
    raw_user_agent: 'unknown',
    parsed_user_agent: '?',
    raw_referrer: 'unknown',
    parsed_referrer: '?'
  };

  const exctractStatistics = statsExtractor(req, res);

  it('returns a valid response object', function () {
    let stats = exctractStatistics('canceled', 1337, 100)

    assert.deepEqual(stats, expectedStatsTemplate);
  });
});
