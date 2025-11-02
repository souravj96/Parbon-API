import Joi from 'joi';
import { password, indianPhoneNumber } from './custom.validation.js';

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const phoneLogin = {
  body: Joi.object().keys({
    phone: Joi.string().required().custom(indianPhoneNumber),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const sendMobileOtp = {
  body: Joi.object().keys({
    phone: Joi.string().required().custom(indianPhoneNumber),
  }),
};

const verifyMobileOtp = {
  body: Joi.object().keys({
    phone: Joi.string().required().custom(indianPhoneNumber),
    otp: Joi.string().required().length(6).pattern(/^[0-9]+$/),
    purpose: Joi.string().valid('phone_verification', 'login', 'password_reset').default('phone_verification'),
  }),
};

export default {
  register,
  login,
  phoneLogin,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendMobileOtp,
  verifyMobileOtp
};
