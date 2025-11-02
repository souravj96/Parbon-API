import httpStatus from 'http-status';
import tokenService from './token.service.js';
import userService from './user.service.js';
import Token from '../models/token.model.js';
import ApiError from '../utils/ApiError.js';
import { tokenTypes } from '../config/tokens.js';

/**
 * Logout
 * @param {string} userId
 * @returns {Promise}
 */
const logout = async (userId) => {
  // Remove all refresh tokens for the user
  await Token.deleteMany({ user: userId, type: tokenTypes.REFRESH });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    // Delete the old refresh token
    await Token.deleteOne({ token: refreshToken, type: tokenTypes.REFRESH });
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

export default {
  logout,
  refreshAuth,
};
