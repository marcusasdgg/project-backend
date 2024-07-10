import { describe, expect, test, beforeEach } from '@jest/globals';
import { adminAuthRegisterHelper, adminAuthLoginHelper, clearHelper } from './httpHelperFunctions';

describe('testing adminAuthLogin function', () => {
  beforeEach(() => {
    clearHelper();
  });

  describe('testing failure case', () => {
    test('test for invalid email', () => {
      adminAuthRegisterHelper('john@gmail.com', 'ThisisavalidPW123', 'John', 'Smith');
      const email = 'sarah@gmail.com';
      const password = 'ThisisavalidPW123';
      expect(adminAuthLoginHelper(email, password)).toStrictEqual({
        error: 'Email address does not exist',
      });
    });

    test('test for valid email with invalid password', () => {
      adminAuthRegisterHelper('sarah@gmail.com', 'passwordA2', 'sarah', 'smith');
      const email = 'sarah@gmail.com';
      const password = 'passwordBBB2';
      expect(adminAuthLoginHelper(email, password)).toStrictEqual({
        error: 'The password is incorrect',
      });
    });

    test('test for invalid email and invalid password', () => {
      adminAuthRegisterHelper('johhny@gmail.com', 'passwordBB2', 'johnny', 'smith');
      const email = 'invalidjohhny@gmail.com';
      const password = 'notpasswordBB2';
      expect(adminAuthLoginHelper(email, password)).toStrictEqual({
        error: 'Email address does not exist',
      });
    });
  });

  describe('testing success case', () => {
    test('testing for an email and password that is valid', () => {
      adminAuthRegisterHelper('jane@gmail.com', 'validPassword123', 'sarah', 'smith');
      const email = 'jane@gmail.com';
      const password = 'validPassword123';
      expect(adminAuthLoginHelper(email, password)).toStrictEqual({
        sessionId: expect.any(Number),
      });
    });
  });
});
