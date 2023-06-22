const accountService = require('../services/account');

const findAccount = async (req, res) => {
  const { accountId } = req.params;
  const result = await accountService.findAccount(accountId);
  return res.send({ status: 1, result });
};

const updateAccount = async (req, res) => {
  const { accountId } = req.params;
  const data = req.body;
  const result = await accountService.updateAccount(accountId, data);
  return res.send({ status: 1, result });
};

module.exports = { findAccount, updateAccount };
