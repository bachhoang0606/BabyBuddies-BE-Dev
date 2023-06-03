const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const staffDao = require('../daos/staff');

const home = async () => {
  const staffs = await staffDao.allStaff();
  return { staffs, text: 'hello work!' };
};

module.exports = { home };
