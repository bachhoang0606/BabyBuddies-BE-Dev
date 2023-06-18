const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const staffDao = require('../daos/staff');

const findStaff = async (condition) => {
  const staff = await staffDao.findStaff(condition);
  return staff;
};

module.exports = { findStaff };
