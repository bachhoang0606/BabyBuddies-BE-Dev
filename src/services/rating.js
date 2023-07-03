const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const ratingDao = require('../daos/rating');
const staffDao = require('../daos/staff');

const storeRating = async (userId, staffId, data) => {
    const staff = await staffDao.findStaff(staffId);
    if (!staff) throw new CustomError(errorCodes.NOT_FOUND, 'Staff not found!');
    if(staff.rating.find(rate => rate.userId == userId)) throw new CustomError(errorCodes.CONFLICT, 'Rating has exited!');
    const rating = await ratingDao.storeRating(userId, staffId, data);
    return rating;
};

const deleteRating = async (ratingId) => {
    const rating = await ratingDao.deleteRating(ratingId);
    return rating;
};

module.exports = { storeRating, deleteRating };
