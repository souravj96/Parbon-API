import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import { authService, userService, tokenService, emailService, smsService } from '../services/index.js';

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const phoneLogin = catchAsync(async (req, res) => {
  const { phone } = req.body;
  
  // Check if user exists with this phone number
  const user = await userService.getUserByPhone(phone);
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: 'No account found with this phone number'
    });
  }
  
  if (!user.isPhoneVerified) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: 'Phone number not verified. Please verify your phone number first.'
    });
  }
  
  // Send OTP for login
  try {
    const result = await smsService.sendPhoneVerificationOTP(phone, 'login');
    
    res.status(httpStatus.OK).send({
      message: 'Login OTP sent successfully',
      phoneNumber: result.phoneNumber,
      sid: result.sid
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Failed to send login OTP',
      error: error.message
    });
  }
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendMobileOtp = catchAsync(async (req, res) => {
  const { phone } = req.body;
  
  try {
    const result = await smsService.sendPhoneVerificationOTP(phone);
    
    res.status(httpStatus.OK).send({
      message: result.message,
      phoneNumber: result.phoneNumber,
      sid: result.sid
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Failed to send OTP',
      error: error.message
    });
  }
});

const verifyMobileOtp = catchAsync(async (req, res) => {
  const { phone, otp, purpose = 'phone_verification' } = req.body;
  
  try {
    const result = await smsService.verifyOTP(phone, otp, purpose);
    
    if (result.success) {
      // Check if user exists with this phone number
      let user = await userService.getUserByPhone(phone);
      
      if (!user && purpose === 'phone_verification') {
        // Create a new user if phone verification is successful and user doesn't exist
        user = await userService.createUserWithPhone({
          phoneNumber: phone,
          isPhoneVerified: true
        });
      } else if (user && purpose === 'phone_verification') {
        // Update existing user to mark phone as verified
        user = await userService.updateUserById(user.id, { isPhoneVerified: true });
      }
      
      if (user) {
        // Generate JWT tokens for the user
        const tokens = await tokenService.generateAuthTokens(user);
        
        res.status(httpStatus.OK).send({
          message: result.message,
          phoneNumber: phone,
          verified: true,
          user,
          tokens
        });
      } else {
        res.status(httpStatus.OK).send({
          message: result.message,
          phoneNumber: phone,
          verified: true
        });
      }
    } else {
      res.status(httpStatus.BAD_REQUEST).send({
        message: result.message,
        phoneNumber: phone,
        verified: false
      });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
});

export default {
  register,
  login,
  phoneLogin,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  sendMobileOtp,
  verifyMobileOtp
};
