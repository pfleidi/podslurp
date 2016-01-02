'use strict';

module.exports = function statsDB(config) {
  const storage = {};

  function countItem(bucket, name) {
    incrementItem(bucket, name, 1);
  }

  function incrementItem(bucket, name, number) {
    storage[bucket] = storage[bucket] || {};
    storage[bucket][name] = storage[bucket][name] || 0;

    storage[bucket][name] += number;
  }

  function getAll() {
    return {
      files: mapFiles()
    }
  }

  function mapFiles() {
    return Object.keys(storage).map(function (key) {
      return { fileName: key, stats: storage[key] }
    });
  }

  return {
    count: countItem,
    inc: incrementItem,
    getAll: getAll
  };
};
