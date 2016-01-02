module.exports = function api(config, statsDB) {
  return function (req, res) {
    res.json(statsDB.getAll());
  };
};
