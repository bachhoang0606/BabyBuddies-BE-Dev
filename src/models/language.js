const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

module.exports = mongoose.model('Language', languageSchema);
