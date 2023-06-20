const mongoose = require('mongoose');
const RoleEnum = require('../constants/RoleEnum');
const AccountStatusEnum = require('../constants/AccountStatusEnum')
const WantToEnum = require('../constants/WantToEnum');

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
    userInfo: {
      name: { type: String, required: true },
      gender: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      nationality: { type: String, required: true },
      wantTo: {
        type: String,
        enum: Object.values(WantToEnum),
        required: true,
        default: WantToEnum.ChildCare,
      },
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Account', accountSchema);
