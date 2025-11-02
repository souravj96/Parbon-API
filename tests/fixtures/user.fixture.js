import mongoose from 'mongoose';
import faker from 'faker';
import User from '../../src/models/user.model.js';

const userOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  phoneNumber: '+919876543210',
  role: 'user',
  isPhoneVerified: true,
};

const userTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  phoneNumber: '+919876543211',
  role: 'user',
  isPhoneVerified: true,
};

const admin = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  phoneNumber: '+919876543212',
  role: 'admin',
  isPhoneVerified: true,
};

const insertUsers = async (users) => {
  await User.insertMany(users);
};

export {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
