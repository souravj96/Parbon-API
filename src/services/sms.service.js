import twilio from 'twilio';
import config from '../config/config.js';
import logger from '../config/logger.js';
import { OTP } from '../models/index.js';

// Initialize Twilio client
const client = twilio(config.twilio.accountSid, config.twilio.authToken);

/**
 * Send SMS message
 * @param {string} to - Phone number to send SMS to
 * @param {string} message - Message content
 * @returns {Promise}
 */
const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: config.twilio.phoneNumber,
      to: to,
    });
    logger.info(`SMS sent successfully to ${to}. SID: ${result.sid}`);
    return result;
  } catch (error) {
    logger.error(`Failed to send SMS to ${to}: ${error.message}`);
    throw error;
  }
};

/**
 * Generate OTP (6-digit number)
 * @returns {string}
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via SMS
 * @param {string} phoneNumber - Phone number to send OTP to
 * @param {string} otp - OTP code to send
 * @returns {Promise}
 */
const sendOTP = async (phoneNumber, otp) => {
  const message = `Your verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`;
  return await sendSMS(phoneNumber, message);
};

/**
 * Send OTP for phone verification
 * @param {string} phoneNumber - Phone number to send OTP to
 * @param {string} purpose - Purpose of OTP (phone_verification, login, password_reset)
 * @returns {Promise<{otp: string, sid: string}>}
 */
const sendPhoneVerificationOTP = async (phoneNumber, purpose = 'phone_verification') => {
  const otp = generateOTP();
  
  // Save OTP to database
  await OTP.createOTP(phoneNumber, otp, purpose, 10); // 10 minutes expiry
  
  const result = await sendOTP(phoneNumber, otp);
  
  return {
    sid: result.sid,
    phoneNumber: phoneNumber,
    message: 'OTP sent successfully'
  };
};

/**
 * Send OTP for login verification
 * @param {string} phoneNumber - Phone number to send OTP to
 * @returns {Promise<{sid: string}>}
 */
const sendLoginOTP = async (phoneNumber) => {
  return await sendPhoneVerificationOTP(phoneNumber, 'login');
};

/**
 * Verify OTP
 * @param {string} phoneNumber - Phone number
 * @param {string} otp - OTP to verify
 * @param {string} purpose - Purpose of OTP
 * @returns {Promise<{success: boolean, message: string}>}
 */
const verifyOTP = async (phoneNumber, otp, purpose = 'phone_verification') => {
  return await OTP.verifyOTP(phoneNumber, otp, purpose);
};

export default {
  sendSMS,
  generateOTP,
  sendOTP,
  sendPhoneVerificationOTP,
  sendLoginOTP,
  verifyOTP,
};