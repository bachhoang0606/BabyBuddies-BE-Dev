const staffService = require('../services/staff');

const findStaff = async (req, res) => {
  const { staffId } = req.params;
  const result = await staffService.findStaff(staffId);
  return res.send({ status: 1, result });
};

module.exports = { findStaff };
