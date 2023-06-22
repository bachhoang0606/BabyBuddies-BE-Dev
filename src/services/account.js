const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const accountDao = require('../daos/account');

const findAccount = async (condition) => {
  const account = await accountDao.findAccount(condition);
  return account;
};

const updateAccount = async (accountId, data) => {
    const account = await accountDao.updateAccount(accountId, data);
    return account;
  };

module.exports = { findAccount, updateAccount };
