const mongoose = require('mongoose');
const RoleEnum = require('../constants/RoleEnum');
const AccountStatusEnum = require('../constants/AccountStatusEnum')

const accountSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      required: true,
      default: RoleEnum.User,
    },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatusEnum),
      required: true,
      default: AccountStatusEnum.Active,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Account', accountSchema);
