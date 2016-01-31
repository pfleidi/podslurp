'use strict';

const parseUserAgent = require('./user_agent_parser');

module.exports = function statsExtractor(req, res) {

  function exctractStatistics(transferState, duration, sentBytes) {
    let referrer = req.headers.referrer || 'unknown';
    let userAgent = req.headers['user-agent'] || 'unknown';
    let parsedUserAgent = parseUserAgent(userAgent);

    return {
      transfer_state: transferState,
      transferred_bytes: sentBytes,
      transfer_time: duration,
      response_code: res.statusCode,
      ip_address: req.ip,
      country: '?',
      raw_user_agent: userAgent,
      parsed_user_agent: parsedUserAgent,
      raw_referrer: referrer,
      parsed_referrer: '?'
    };
  }

  return exctractStatistics;
};

