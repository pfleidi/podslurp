'use strict';

const url = require('url');
const geoip = require('geoip-lite');

const parseUserAgent = require('./user_agent_parser');

module.exports = function statsExtractor(req, res) {

  function lookupCountry(ipAddress) {
    let geo = geoip.lookup(ipAddress);

    if (!geo) {
      return 'unknown';
    }

    return geo.country;
  }

  function parseReferrer(referrer) {
    if (referrer === 'unknown') {
      return 'unknown';
    }

    return url.parse(referrer).host;
  }

  function exctractStatistics(transferState, duration, sentBytes) {
    let referrer = req.headers.referrer || 'unknown';
    let parsedReferrer = parseReferrer(referrer);

    let userAgent = req.headers['user-agent'] || 'unknown';
    let parsedUserAgent = parseUserAgent(userAgent);

    let country = lookupCountry(req.ip);

    return {
      transfer_state: transferState,
      transferred_bytes: sentBytes,
      transfer_time: duration,
      response_code: res.statusCode,
      ip_address: req.ip,
      country: country,
      raw_user_agent: userAgent,
      parsed_user_agent: parsedUserAgent,
      raw_referrer: referrer,
      parsed_referrer: parsedReferrer
    };
  }

  return exctractStatistics;
};

