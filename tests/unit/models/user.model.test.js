import faker from 'faker';
import { User } from '../../../src/models/index.js';

describe('User model', () => {
  describe('User validation', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        name: faker.name.findName(),
        phoneNumber: '+919876543210',
        role: 'user',
      };
    });

    test('should correctly validate a valid user', async () => {
      await expect(new User(newUser).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if phoneNumber is invalid', async () => {
      newUser.phoneNumber = 'invalidPhone';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });

    test('should throw a validation error if phoneNumber is missing', async () => {
      delete newUser.phoneNumber;
      await expect(new User(newUser).validate()).rejects.toThrow();
    });

    test('should throw a validation error if role is unknown', async () => {
      newUser.role = 'invalid';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });
  });

  describe('User toJSON()', () => {
    test('should return user without sensitive fields when toJSON is called', () => {
      const newUser = {
        name: faker.name.findName(),
        phoneNumber: '+919876543210',
        role: 'user',
      };
      const userJson = new User(newUser).toJSON();
      expect(userJson).not.toHaveProperty('__v');
      expect(userJson).toHaveProperty('phoneNumber');
      expect(userJson).toHaveProperty('name');
      expect(userJson).toHaveProperty('role');
    });
  });
});
