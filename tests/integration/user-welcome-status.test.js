import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import setupTestDB from '../utils/setupTestDB.js';
import { User } from '../../src/models/index.js';
import { userOne, admin, insertUsers } from '../fixtures/user.fixture.js';
import { userOneAccessToken, adminAccessToken } from '../fixtures/token.fixture.js';

// Setup test database
setupTestDB();

describe('User Welcome Status routes', () => {
  describe('PATCH /v1/users/welcome-status', () => {
    beforeEach(async () => {
      await insertUsers([userOne, admin]);
    });

    test('should return 200 and update welcome status when user updates their own status', async () => {
      const res = await request(app)
        .patch('/v1/users/welcome-status')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ isWelcomeDone: true })
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          id: userOne._id.toHexString(),
          name: userOne.name,
          email: userOne.email,
          role: userOne.role,
          isEmailVerified: userOne.isEmailVerified,
          isPhoneVerified: false, // This field defaults to false in the model
          isWelcomeDone: true,
        })
      );

      const dbUser = await User.findById(userOne._id);
      expect(dbUser.isWelcomeDone).toBe(true);
    });

    test('should return 200 and update welcome status to false', async () => {
      // First set welcome status to true
      await User.findByIdAndUpdate(userOne._id, { isWelcomeDone: true });

      const res = await request(app)
        .patch('/v1/users/welcome-status')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ isWelcomeDone: false })
        .expect(httpStatus.OK);

      expect(res.body.isWelcomeDone).toBe(false);

      const dbUser = await User.findById(userOne._id);
      expect(dbUser.isWelcomeDone).toBe(false);
    });

    test('should return 400 error if isWelcomeDone is missing', async () => {
      await request(app)
        .patch('/v1/users/welcome-status')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({})
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if isWelcomeDone is not a boolean', async () => {
      await request(app)
        .patch('/v1/users/welcome-status')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ isWelcomeDone: 'true' })
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app)
        .patch('/v1/users/welcome-status')
        .send({ isWelcomeDone: true })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 when admin user updates their own welcome status', async () => {
      const res = await request(app)
        .patch('/v1/users/welcome-status')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ isWelcomeDone: true })
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          id: admin._id.toHexString(),
          name: admin.name,
          email: admin.email,
          role: admin.role,
          isWelcomeDone: true,
        })
      );

      const dbUser = await User.findById(admin._id);
      expect(dbUser.isWelcomeDone).toBe(true);
    });
  });
});