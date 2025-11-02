import Joi from 'joi';
import { objectId, indianPhoneNumber } from './custom.validation.js';

const createUser = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required().custom(indianPhoneNumber),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      phoneNumber: Joi.string().custom(indianPhoneNumber),
      name: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateWelcomeStatus = {
  body: Joi.object().keys({
    isWelcomeDone: Joi.boolean().strict().required(),
  }),
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateWelcomeStatus,
  deleteUser,
};
