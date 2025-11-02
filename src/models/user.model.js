import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins/index.js';
import { roles } from '../config/roles.js';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!value.match(/^(\+91|91)?[6-9]\d{9}$/)) {
          throw new Error('Invalid Indian phone number');
        }
      },
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isWelcomeDone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if phone number is taken
 * @param {string} phoneNumber - The user's phone number
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPhoneNumberTaken = async function (phoneNumber, excludeUserId) {
  const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.pre('save', async function (next) {
  const user = this;
  // No password hashing needed since we removed password support
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

export default User;
