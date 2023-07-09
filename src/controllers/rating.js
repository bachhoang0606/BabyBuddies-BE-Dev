const ratingService = require('../services/rating');

const storeRating = async (req, res) => {
    // const userId = req.user._id;
    // const userId = '647b77348af6c322511fed59';
    const { staffId } = req.params;
    const { review, star, userId } = req.body;
    const result = await ratingService.storeRating(userId, staffId, {
        review,
        star,
    });
    return res.send({ status: 1, result });
};

const deleteRating = async (req, res) => {
    // const userId = req.user._id;
    const userId = '647b77348af6c322511fed59';
    const { ratingId } = req.params;
    const result = await ratingService.deleteRating(ratingId);
    return res.send({ status: 1, result });
};

module.exports = { storeRating, deleteRating };
