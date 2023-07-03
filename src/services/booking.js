const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const { ObjectId } = require('mongoose').Types;

const convertFilterToRegex = require('../utils/convertFilterToRegex');
const accountDao = require('../daos/account');

const allBooking = async (userId, conditions) => {
    const { sortField, sortOrder, ...prefilter } = conditions;
    let sort;
    if (typeof sortField !== 'undefined')
        sort = { [sortField]: sortOrder || -1 };
    const filter = convertFilterToRegex(prefilter);
    const bookings = await accountDao.findAccount(userId);
    return bookings;
};

const findBooking = async (condition) => {
    const booking = await accountDao.findBooking(condition);
    return booking;
};

const storeBooking = async (
    userId,
    { staffId, startDay, endDay, message, total },
) => {
    return await accountDao.storeBooking(ObjectId(userId), {
        staffId: ObjectId(staffId),
        startDay,
        endDay,
        message,
        total,
    });
};

const updateBooking = async (bookingId, data) => {
    const booking = await accountDao.updateBooking(bookingId, data);
    return booking;
};

const deleteBooking = async (bookingId) => {
    const booking = await accountDao.deleteBooking(bookingId);
    return booking;
};

module.exports = {
    allBooking,
    findBooking,
    storeBooking,
    updateBooking,
    deleteBooking,
};
