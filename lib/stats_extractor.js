'use strict';

const send = require('send');
const mime = require('mime-types')

module.exports = function statsExtractor(req, res) {

  function exctractStatistics(transferState, duration, sentBytes) {
    return {
      transfer_state: transferState,
      transferred_bytes: sentBytes,
      transfer_time: duration,
      response_code: res.statusCode,
      ip_address: req.ip,
      country: '?',
      raw_user_agent: req.headers['user-agent'] || 'unknown',
      parsed_user_agent: '?',
      raw_referrer: req.headers.referrer || 'unknown',
      parsed_referrer: '?'
    };
  }

  return exctractStatistics;
};

