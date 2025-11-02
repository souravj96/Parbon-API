import express from 'express';
import validate from '../../middlewares/validate.js';
import authValidation from '../../validations/auth.validation.js';
import authController from '../../controllers/auth.controller.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();

router.post('/phone-login', validate(authValidation.phoneLogin), authController.phoneLogin);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/send-mobile-otp', validate(authValidation.sendMobileOtp), authController.sendMobileOtp);
router.post('/verify-mobile-otp', validate(authValidation.verifyMobileOtp), authController.verifyMobileOtp);

export default router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Mobile Phone Authentication
 */

/**
 * @swagger
 * /auth/send-mobile-otp:
 *   post:
 *     summary: Send OTP to mobile phone
 *     description: Send a 4-digit OTP to the provided Indian mobile phone number for verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 pattern: '^(\+91|91)?[6-9]\d{9}$'
 *                 description: Indian mobile phone number with or without country code
 *             example:
 *               phone: "+919876543210"
 *     responses:
 *       "200":
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP sent successfully"
 *                 phoneNumber:
 *                   type: string
 *                   example: "+919876543210"
 *                 sid:
 *                   type: string
 *                   description: Twilio message SID
 *                   example: "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /auth/verify-mobile-otp:
 *   post:
 *     summary: Verify mobile OTP
 *     description: Verify the OTP sent to mobile phone and create/login user with JWT tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *               - purpose
 *             properties:
 *               phone:
 *                 type: string
 *                 pattern: '^(\+91|91)?[6-9]\d{9}$'
 *                 description: Indian mobile phone number with or without country code
 *               otp:
 *                 type: string
 *                 pattern: '^\d{4}$'
 *                 description: 4-digit OTP received on mobile
 *               purpose:
 *                 type: string
 *                 enum: [phone_verification, login]
 *                 description: Purpose of OTP verification
 *             example:
 *               phone: "+919876543210"
 *               otp: "1234"
 *               purpose: "phone_verification"
 *     responses:
 *       "200":
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully"
 *                 phoneNumber:
 *                   type: string
 *                   example: "+919876543210"
 *                 verified:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         description: Invalid OTP or phone number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired OTP"
 *                 phoneNumber:
 *                   type: string
 *                   example: "+919876543210"
 *                 verified:
 *                   type: boolean
 *                   example: false
 */

/**
 * @swagger
 * /auth/phone-login:
 *   post:
 *     summary: Login with phone number
 *     description: Send login OTP to verified phone number for authentication
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 pattern: '^(\+91|91)?[6-9]\d{9}$'
 *                 description: Indian mobile phone number with or without country code
 *             example:
 *               phone: "+919876543210"
 *     responses:
 *       "200":
 *         description: Login OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login OTP sent successfully"
 *                 phoneNumber:
 *                   type: string
 *                   example: "+919876543210"
 *                 sid:
 *                   type: string
 *                   description: Twilio message SID
 *                   example: "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
 *       "400":
 *         description: Phone number not verified or invalid format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: "Phone number not verified. Please verify your phone number first."
 *       "404":
 *         description: No account found with this phone number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 404
 *               message: "No account found with this phone number"
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     description: Logout user and blacklist refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/refresh-tokens:
 *   post:
 *     summary: Refresh auth tokens
 *     description: Generate new access and refresh tokens using a valid refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */