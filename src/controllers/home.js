const homeService = require('../services/home');

const home = async (req, res) => {
  const result = await homeService.home();
  return res.send({ status: 1, result });
};

module.exports = { home };
