'use strict';

const useragent = require('useragent');

module.exports = function statistics(config) {
  const storage = {};

  function countCompleteDownload(fileName, headers) {
    var bucket = getBucketForFile(fileName);
    var stats = bucket.completeDownloads;
    var agentFamily = parseUserAgentFamily(headers);

    stats.count += 1;
    stats.userAgents[agentFamily] = stats.userAgents[agentFamily] || 0;
    stats.userAgents[agentFamily] += 1;
  }

  function countIncompleteDownload(fileName, headers) {
    var bucket = getBucketForFile(fileName);
    var stats = bucket.incompleteDownloads;
    var agentFamily = parseUserAgentFamily(headers);

    stats.count += 1;
    stats.userAgents[agentFamily] = stats.userAgents[agentFamily] || 0;
    stats.userAgents[agentFamily] += 1;
  }

  function parseUserAgentFamily(headers) {
    var agent = useragent.parse(headers['user-agent']);

    return agent.family;
  }

  function countBytes(fileName, byteLength) {
    var bucket = getBucketForFile(fileName);

    bucket.sentBytes += byteLength;
  }

  function getBucketForFile(fileName) {
    if (!storage.hasOwnProperty(fileName)) {
      storage[fileName] = createDefaultBucket(fileName);
    }

    return storage[fileName];
  }

  function createDefaultBucket(fileName) {
    return {
      fileName: fileName,
      sentBytes: 0,
      completeDownloads: {
        count: 0,
        userAgents: {}
      },
      incompleteDownloads: {
        count: 0,
        userAgents: {}
      }
    };
  }

  function getAll() {
    return storage;
  }

  return {
    countCompleteDownload: countCompleteDownload,
    countIncompleteDownload: countIncompleteDownload,
    countBytes: countBytes,
    getAll: getAll
  };
};
