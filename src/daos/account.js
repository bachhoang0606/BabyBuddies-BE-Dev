const { ObjectId } = require('mongoose').Types;
const Account = require('../models/account');

const createAccount = async ({ email, password }) => {
  const account = await Account.create({ email, password });
  return account;
};

const findAccount = async (condition) => {
  if (ObjectId.isValid(condition)) {
    const account = await Account.findById(condition);
    return account;
  }

  if (typeof condition === 'object' && condition !== null) {
    const account = await Account.findOne(condition);
    return account;
  }

  return null;
};

const updateAccount = async (accountId, data) => {
  const account = await Account.findByIdAndUpdate(accountId, data, {
    new: true,
  });
  return account;
};

const deleteAccount = async (accountId) => {
  await Account.findByIdAndDelete(accountId);
};

module.exports = { createAccount, findAccount, updateAccount, deleteAccount };
