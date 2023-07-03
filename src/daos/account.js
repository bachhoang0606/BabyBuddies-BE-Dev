const { ObjectId } = require('mongoose').Types;
const Account = require('../models/account');

const createAccount = async ({ email, password }) => {
    const account = await Account.create({ email, password });
    return account;
};

const findAccount = async (condition) => {
    if (ObjectId.isValid(condition)) {
        const account = await Account.aggregate([
            { $match: { _id: ObjectId(condition) } },
            {
                $unwind:
                    /**
                     * path: Path to the array field.
                     * includeArrayIndex: Optional name for index.
                     * preserveNullAndEmptyArrays: Optional
                     *   toggle to unwind null and empty values.
                     */
                    {
                        path: '$booking',
                        preserveNullAndEmptyArrays: true,
                    },
            },
            {
                $lookup:
                    /**
                     * from: The target collection.
                     * localField: The local join field.
                     * foreignField: The target join field.
                     * as: The name for the results.
                     * pipeline: Optional pipeline to run on the foreign collection.
                     * let: Optional variables to use in the pipeline field stages.
                     */
                    {
                        from: 'staffs',
                        localField: 'booking.staffId',
                        foreignField: '_id',
                        as: 'staff',
                    },
            },
            {
                $unwind:
                    /**
                     * path: Path to the array field.
                     * includeArrayIndex: Optional name for index.
                     * preserveNullAndEmptyArrays: Optional
                     *   toggle to unwind null and empty values.
                     */
                    {
                        path: '$staff',
                        preserveNullAndEmptyArrays: true,
                    },
            },
            {
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                $project: {
                    _id: '$_id',
                    accountStatus: '$accountStatus',
                    username: '$username',
                    booking: {
                        $cond: {
                            if: {
                                $ifNull: ['$booking', false],
                            },
                            then: {
                                $mergeObjects: [
                                    '$booking',
                                    {
                                        fullName: '$staff.fullName',
                                        address: '$staff.address',
                                        phone: '$staff.phone',
                                        address: '$staff.address',
                                        gender: '$staff.gender',
                                        salary: '$staff.salary',
                                    },
                                ],
                            },
                            else: '$$REMOVE',
                        },
                    },
                },
            },
            {
                $group:
                    /**
                     * _id: The id of the group.
                     * fieldN: The first field name.
                     */
                    {
                        _id: '$_id',
                        accountStatus: {
                            $first: '$accountStatus',
                        },
                        username: {
                            $first: '$username',
                        },
                        accountStatus: {
                            $first: '$accountStatus',
                        },
                        booking: {
                            $push: '$booking',
                        },
                    },
            },
        ]);
        return account[0];
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

const findBooking = async (condition) => {
    if (ObjectId.isValid(condition)) {
        const booking = await Account.aggregate([
            {
                $match:
                    /**
                     * query: The query in MQL.
                     */
                    {
                        'booking._id': ObjectId(condition),
                    },
            },
            {
                $unwind:
                    /**
                     * path: Path to the array field.
                     * includeArrayIndex: Optional name for index.
                     * preserveNullAndEmptyArrays: Optional
                     *   toggle to unwind null and empty values.
                     */
                    {
                        path: '$booking',
                        preserveNullAndEmptyArrays: true,
                    },
            },
            {
                $match:
                    /**
                     * query: The query in MQL.
                     */
                    {
                        'booking._id': ObjectId(condition),
                    },
            },
        ]);
        return booking[0];
    }

    if (typeof condition === 'object' && condition !== null) {
        const language = await Language.findOne(condition);
        return language;
    }

    return null;
};

const storeBooking = async (accountId, data) => {
    return await Account.findByIdAndUpdate(
        accountId,
        { $push: { booking: data } },
        { new: true },
    );
};

const updateBooking = async (bookingId, data) => {
    return await Account.findOneAndUpdate(
        { 'booking._id': ObjectId(bookingId) },
        {
            $set: {
                'booking.$.staffId': ObjectId(data.staffId),
                'booking.$.startDay': data.startDay,
                'booking.$.endDay': data.endDay,
                'booking.$.message': data.message,
                'booking.$.total': data.total,
            },
        },
        { new: true },
    );
};

const deleteBooking = async (bookingId) => {
    return await Account.findOneAndUpdate(
        { 'booking._id': ObjectId(bookingId) },
        { $pull: { booking: { _id: ObjectId(bookingId) } } },
        { new: true },
    );
};

module.exports = {
    createAccount,
    findAccount,
    updateAccount,
    deleteAccount,
    findBooking,
    storeBooking,
    updateBooking,
    deleteBooking,
};
