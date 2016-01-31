'use strict';

var useragent = require('useragent');

module.exports = function statsExtractor(req, res) {

  function extractUserAgent() {
    return req.headers['user-agent'] || 'unknown';
  }

  function parseUserAgent() {
    let ua = extractUserAgent();
    let parsedUa = useragent.parse(ua);

    return parsedUa.family;
  }

  function exctractStatistics(transferState, duration, sentBytes) {
    return {
      transfer_state: transferState,
      transferred_bytes: sentBytes,
      transfer_time: duration,
      response_code: res.statusCode,
      ip_address: req.ip,
      country: '?',
      raw_user_agent: extractUserAgent(),
      parsed_user_agent: parseUserAgent(),
      raw_referrer: req.headers.referrer || 'unknown',
      parsed_referrer: '?'
    };
  }

  return exctractStatistics;
};

