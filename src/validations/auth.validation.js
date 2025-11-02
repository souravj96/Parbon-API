import Joi from 'joi';
import { indianPhoneNumber } from './custom.validation.js';

const phoneLogin = {
  body: Joi.object().keys({
    phone: Joi.string().required().custom(indianPhoneNumber),
  }),
};

const logout = {
  body: Joi.object().keys({}),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
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
    otp: Joi.string().required().length(4).pattern(/^[0-9]+$/),
    purpose: Joi.string().valid('phone_verification', 'login', 'password_reset').default('phone_verification'),
  }),
};

export default {
  phoneLogin,
  logout,
  refreshTokens,
  sendMobileOtp,
  verifyMobileOtp
};
