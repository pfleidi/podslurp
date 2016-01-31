'use strict';

const useragent = require('useragent');
const _ = require('lodash');

const UA_PATTERN = /^(\w+(\s\w+)*)(\/(\d+(\.\d+)*))?(.*)$/;
const MANUAL_FAMILIES = [
  'Other',
  'CFNetwork',
  'Android'
];

function parseUserAgent(userAgentString) {
  userAgentString = userAgentString || 'unknown';

  let parsedUa = useragent.parse(userAgentString);

  if (userAgentString !== 'unknown' && _.contains(MANUAL_FAMILIES, parsedUa.family)) {
    return matchCustomUA(userAgentString);
  }

  return parsedUa.family;
}

function matchCustomUA(userAgentString) {
  let match = userAgentString.match(UA_PATTERN);

  if (!match) { return 'Other'; }

  return match[1];
}

module.exports = parseUserAgent;
