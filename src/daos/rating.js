const { ObjectId } = require('mongoose').Types;
const Staff = require('../models/staff');

const storeRating = async (userId, staffId, data) => {
    return await Staff.findByIdAndUpdate(
        staffId,
        { $push: { rating: { ...data, userId: ObjectId(userId) } } },
        { new: true },
    );
};

const deleteRating = async (ratingId) => {
    return await Staff.findOneAndUpdate(
        { 'rating._id': ratingId },
        { $pull: { rating: { _id: ratingId } } },
        { new: true },
    );
};

module.exports = { storeRating, deleteRating };
