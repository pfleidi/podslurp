module.exports = function api(config, models) {

  return function (req, res) {
    res.json({ files: [] });
  };
};
