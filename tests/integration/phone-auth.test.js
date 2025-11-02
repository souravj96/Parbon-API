import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import setupTestDB from '../utils/setupTestDB.js';

// Setup test database
setupTestDB();

describe('Phone Authentication routes', () => {
  describe('POST /v1/auth/send-mobile-otp', () => {
    const validPhoneNumber = '+919876543210';
    const invalidPhoneNumber = '1234567890';

    test('should return 400 error for invalid phone number', async () => {
      const res = await request(app)
        .post('/v1/auth/send-mobile-otp')
        .send({ phone: invalidPhoneNumber });
      
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
      expect(res.body.message).toContain('phone must be a valid Indian phone number');
    });

    test('should return 400 error if phone number is missing', async () => {
      const res = await request(app)
        .post('/v1/auth/send-mobile-otp')
        .send({});
      
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });

    test('should accept valid Indian phone number format', async () => {
      const res = await request(app)
        .post('/v1/auth/send-mobile-otp')
        .send({ phone: validPhoneNumber });
      
      // Should either succeed or fail due to Twilio trial account limitations
      // but not due to validation errors
      expect([httpStatus.OK, httpStatus.INTERNAL_SERVER_ERROR].includes(res.status)).toBe(true);
      
      if (res.status === httpStatus.INTERNAL_SERVER_ERROR) {
        // If it fails, it should be due to Twilio limitations, not validation
        expect(res.body.message).toContain('Failed to send OTP');
      }
    });
  });

  describe('POST /v1/auth/verify-mobile-otp', () => {
    const validPhoneNumber = '+919876543210';

    test('should return 400 error for invalid phone number format', async () => {
      const res = await request(app)
        .post('/v1/auth/verify-mobile-otp')
        .send({
          phone: '1234567890',
          otp: '1234',
          purpose: 'phone_verification'
        });
      
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error for invalid OTP format', async () => {
      const res = await request(app)
        .post('/v1/auth/verify-mobile-otp')
        .send({
          phone: validPhoneNumber,
          otp: '123', // 3 digits instead of 4
          purpose: 'phone_verification'
        });
      
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if required fields are missing', async () => {
      const res = await request(app)
        .post('/v1/auth/verify-mobile-otp')
        .send({
          phone: validPhoneNumber
          // missing otp and purpose
        });
      
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /v1/auth/phone-login', () => {
    test('should return 400 error for invalid phone number format', async () => {
      const res = await request(app)
        .post('/v1/auth/phone-login')
        .send({ phone: '1234567890' });
      
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error for non-existent phone number', async () => {
      const res = await request(app)
        .post('/v1/auth/phone-login')
        .send({ phone: '+919999999999' });
      
      expect(res.status).toBe(httpStatus.NOT_FOUND);
      expect(res.body.message).toBe('No account found with this phone number');
    });
  });
});