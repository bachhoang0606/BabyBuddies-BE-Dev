const { ObjectId } = require('mongoose').Types;
const Staff = require('../models/staff');

const createStaff = async ({
    fullName,
    email,
    address,
    phone,
    cookExp,
    careExp,
    gender,
    birthday,
    salary,
}) => {
    const staff = await Staff.create({
        fullName,
        email,
        address,
        phone,
        cookExp,
        careExp,
        gender,
        birthday,
        salary,
    });
    return staff;
};

const allStaff = async () => {
    const staff = await Staff.aggregate([
        {
            $lookup: {
                from: 'languages',
                let: { userLanguage: '$userLanguage' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $in: ['$_id', '$$userLanguage'] },
                        },
                    },
                ],
                as: 'userLanguage',
            },
        },
    ]);
    return staff;
};

const findStaff = async (condition) => {
    if (ObjectId.isValid(condition)) {
        const staff = await Staff.aggregate([
            { $match: { _id: ObjectId(condition) } },
            {
                $lookup: {
                    from: 'languages',
                    let: { userLanguage: '$userLanguage' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$_id', '$$userLanguage'] },
                            },
                        },
                    ],
                    as: 'userLanguage',
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
                        path: '$rating',
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
                        from: 'accounts',
                        localField: 'rating.userId',
                        foreignField: '_id',
                        as: 'accounts',
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
                        path: '$accounts',
                        preserveNullAndEmptyArrays: true,
                    },
            },
            {
                $project:
                    /**
                     * specifications: The fields to
                     *   include or exclude.
                     */
                    {
                        _id: 1,
                        fullName: 1,
                        email: 1,
                        address: 1,
                        phone: 1,
                        cookExp: 1,
                        careExp: 1,
                        gender: 1,
                        birthday: 1,
                        salary: 1,
                        imageLink: 1,
                        userLanguage: 1,
                        rating: {
                            $cond: {
                                if: {
                                    $ifNull: ['$rating', false],
                                },
                                then: {
                                    _id: '$rating._id',
                                    userId: '$rating.userId',
                                    review: '$rating.review',
                                    star: '$rating.star',
                                    username: '$accounts.username',
                                },
                                else: '$$REMOVE',
                            },
                        },
                    },
            },
            {
                $group:
                    /**
                     * specifications: The fields to
                     *   include or exclude.
                     */
                    {
                        _id: '$_id',
                        fullName: {
                            $first: '$fullName',
                        },
                        email: {
                            $first: '$email',
                        },
                        address: {
                            $first: '$address',
                        },
                        phone: {
                            $first: '$phone',
                        },
                        cookExp: {
                            $first: '$cookExp',
                        },
                        careExp: {
                            $first: '$careExp',
                        },
                        gender: {
                            $first: '$gender',
                        },
                        birthday: {
                            $first: '$birthday',
                        },
                        salary: {
                            $first: '$salary',
                        },
                        userLanguage: {
                            $first: '$userLanguage',
                        },
                        ratings: {
                            $push: '$rating',
                        },
                    },
            },
        ]);
        return staff[0];
    }

    if (typeof condition === 'object' && condition !== null) {
        const staff = await Staff.findOne(condition);
        return staff;
    }

    return null;
};

const updateStaff = async (staffId, data) => {
    const staff = await Staff.findByIdAndUpdate(staffId, data, {
        new: true,
    });
    return staff;
};

const deleteStaff = async (staffId) => {
    await Staff.findByIdAndDelete(staffId);
};

const createRating = async (staffId, { userId, review, start }) => {
    const staff = await Staff.findByIdAndUpdate(
        staffId,
        {
            $push: {
                rating: {
                    userId,
                    review,
                    start,
                },
            },
        },
        {
            new: true,
        },
    );
    return staff;
};

const deleteRating = async (ratingId) => {
    await Staff.updateMany(
        { $pull: { rating: { _id: ratingId } } },
        {
            new: true,
        },
    );
};

module.exports = {
    createStaff,
    allStaff,
    findStaff,
    updateStaff,
    deleteStaff,
    createRating,
    deleteRating,
};
