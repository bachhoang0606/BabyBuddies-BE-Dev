const bookingService = require('../services/booking');

const allBooking = async (req, res) => {
    // const userId = req.user._id;
    const userId = '647b77348af6c322511fed59';
    const conditions = req.query;
    const bookings = await bookingService.allBooking(userId, conditions);
    res.status(200).send(bookings);
};

const findBooking = async (req, res) => {
    const { bookingId } = req.params;
    const booking = await bookingService.findBooking(bookingId);
    res.status(200).send(booking);
};

const storeBooking = async (req, res) => {
    // const userId = req.user._id;
    // const userId = '647b77348af6c322511fed5a';
    const { staffId, startDay, endDay, message, total, userId } = req.body;
    const result = await bookingService.storeBooking(userId, {
        staffId,
        startDay,
        endDay,
        message,
        total,
    });
    return res.send({ status: 1, result });
};

const updateBooking = async (req, res) => {
    const { bookingId } = req.params;
    const { staffId, ...data } = req.body;
    const booking = await bookingService.updateBooking(bookingId, data);
    res.status(200).send(booking);
};

const deleteBooking = async (req, res) => {
    // const userId = req.user._id;
    const userId = '647b77348af6c322511fed59';
    const { bookingId } = req.params;
    const result = await bookingService.deleteBooking(bookingId);
    return res.send({ status: 1, result });
};

module.exports = {
    allBooking,
    findBooking,
    storeBooking,
    updateBooking,
    deleteBooking,
};
