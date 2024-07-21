import { describe, expect, test, beforeEach } from '@jest/globals';
import { 
  clearHelper, 
  adminAuthRegisterHelper, 
  adminAuthLogoutHelper,
  adminAuthLogoutV2Helper 
} from './httpHelperFunctions';

describe('adminAuthLogout', () => {
  let sessionId: number;

  beforeEach(() => {
    clearHelper();
    const registerResponse = adminAuthRegisterHelper(
      'user1@tookah.com',
      'Badpasswordbad1',
      'Bat',
      'Batman'
    );
    if ('sessionId' in registerResponse) {
      sessionId = registerResponse.sessionId;
    }
  });

  describe('Successsful Cases', () => {
    test('logging out', () => {
      expect(adminAuthLogoutHelper(sessionId)).toStrictEqual({});
    });
    
  });

  describe('Failure Cases', () => {
    test('token is invalid (does not refer to valid logged in user session)', () => {
      const invalidSessionId = sessionId + 1;
      expect(adminAuthLogoutHelper(invalidSessionId)).toStrictEqual({ error: expect.any(String) });
    });
  });

  describe('V2 tests', () => {
    test('V2 logging out', () => {
      expect(adminAuthLogoutV2Helper(sessionId)).toStrictEqual({});
    });
    test('V2 token is invalid (does not refer to valid logged in user session)', () => {
      const invalidSessionId = sessionId + 1;
      expect(adminAuthLogoutV2Helper(invalidSessionId)).toStrictEqual({ error: expect.any(String) });
    });
  });
});
