import { describe, expect, test, beforeEach } from '@jest/globals';
import { clearHelper, adminAuthRegisterHelper, adminAuthLogoutHelper } from './httpHelperFunctions';

describe('adminAuthLogout', () => {
  let sessionId: number;

  beforeEach(() => {
    clearHelper();
  });

  describe('Successsful Cases', () => {
    test('logging out', () => {
      const registerResponse = adminAuthRegisterHelper(
        'user1@tookah.com',
        'Badpasswordbad1',
        'Bat',
        'Batman'
      );
      if ('sessionId' in registerResponse) {
        sessionId = registerResponse.sessionId;
      }
      expect(adminAuthLogoutHelper(sessionId)).toStrictEqual({});
    });
  });

  describe('Failure Cases', () => {
    test('token is invalid (does not refer to valid logged in user session)', () => {
      const registerResponse = adminAuthRegisterHelper(
        'user1@tookah.com',
        'Badpasswordbad1',
        'Bat',
        'Batman'
      );
      if ('sessionId' in registerResponse) {
        sessionId = registerResponse.sessionId;
      }
      const invalidSessionId = sessionId + 1;
      expect(adminAuthLogoutHelper(invalidSessionId)).toStrictEqual({ error: expect.any(String) });
    });
  });
});
