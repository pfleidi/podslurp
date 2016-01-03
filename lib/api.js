module.exports = function api(config, statistics) {

  function mapData(stats) {
    var mappedFiles = Object.keys(stats).map(function (key) {
      return stats[key];
    });

    return { files: mappedFiles };
  }

  return function (req, res) {
    var mappedData = mapData(statistics.getAll());
    res.json(mappedData);
  };
};
