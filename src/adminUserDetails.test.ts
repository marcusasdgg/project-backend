import { describe, expect, test, beforeEach } from '@jest/globals';
import { adminAuthLoginHelper, adminAuthRegisterHelper, adminUserDetailsHelper, adminUserDetailsV2Helper, clearHelper } from './httpHelperFunctions';
// change all authuserid to sessionId
describe('testing adminUserDetails function', () => {
  beforeEach(() => {
    clearHelper();
  });

  describe('testing error case for adminUserDetailsV1', () => {
    test('testing invalid userId case for adminUserDetailsV1', () => {
      const registerResponse = adminAuthRegisterHelper('abcd@gmail.com', 'abcdefgh1', 'asd', 'abcde');
      if ('sessionId' in registerResponse) {
        const invalidSessionId = registerResponse.sessionId - 1;
        expect(adminUserDetailsHelper(invalidSessionId)).toStrictEqual({
          error: expect.any(String),
        });
      }
    });
    test('testing invalid userId case for adminUserDetailsV2', () => {
      const registerResponse = adminAuthRegisterHelper('abcd@gmail.com', 'abcdefgh1', 'asd', 'abcde');
      if ('sessionId' in registerResponse) {
        const invalidSessionId = registerResponse.sessionId - 1;
        expect(adminUserDetailsV2Helper(invalidSessionId)).toStrictEqual({
          error: expect.any(String),
        });
      }
    });
  });

  describe('testing success cases for adminUserDetailsV1', () => {
    test('testing successful case upon registration', () => {
      const registerResponse = adminAuthRegisterHelper(
        'validemail@gmail.com',
        'abcdefgh1',
        'John',
        'Doe'
      );

      if ('sessionId' in registerResponse) {
        expect(adminUserDetailsHelper(registerResponse.sessionId)).toStrictEqual({
          user: {
            userId: expect.any(Number), // how to access user ID for this field?
            name: 'John Doe',
            email: 'validemail@gmail.com',
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
          },
        });
      }
    });
    test('testing initial value for numSuccessfulLogins', () => {
      const registerResponse = adminAuthRegisterHelper(
        'validemaill@gmail.com',
        'abcdefgh1',
        'John',
        'Dae'
      );

      // initial registration details
      if ('sessionId' in registerResponse) {
        expect(adminUserDetailsHelper(registerResponse.sessionId)).toStrictEqual({
          user: {
            userId: expect.any(Number),
            name: 'John Dae',
            email: 'validemaill@gmail.com',
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
          },
        });
      }
    });
    test('testing the numSuccessfulLogins with multiple successful logins', () => {
      const registerResponse = adminAuthRegisterHelper(
        'validemaill@gmail.com',
        'abcdefgh1',
        'John',
        'Dae'
      );

      // perform multiple logins after registration
      adminAuthLoginHelper('validemaill@gmail.com', 'abcdefgh1');
      adminAuthLoginHelper('validemaill@gmail.com', 'abcdefgh1');
      adminAuthLoginHelper('validemaill@gmail.com', 'abcdefgh1');

      // check details after multiple logins
      if ('sessionId' in registerResponse) {
        expect(adminUserDetailsHelper(registerResponse.sessionId)).toStrictEqual({
          user: {
            userId: expect.any(Number),
            name: 'John Dae',
            email: 'validemaill@gmail.com',
            numSuccessfulLogins: 4,
            numFailedPasswordsSinceLastLogin: 0,
          },
        });
      }
    });

    test('testing the counter and reset of numFailedPasswordsSinceLastLogin', () => {
      const registerResponse = adminAuthRegisterHelper(
        'validemail@gmail.com',
        'abcdefgh1',
        'Bob',
        'Jones'
      );

      // attempt to login with incorrect password
      if ('sessionId' in registerResponse) {
        adminAuthLoginHelper('validemail@gmail.com', 'incorrectPassword1');
        adminAuthLoginHelper('validemail@gmail.com', 'incorrectPassword2');

        // check details after failed password attempts
        expect(adminUserDetailsHelper(registerResponse.sessionId)).toStrictEqual({
          user: {
            userId: expect.any(Number),
            name: 'Bob Jones',
            email: 'validemail@gmail.com',
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 2,
          },
        });

        // perform a successful login
        adminAuthLoginHelper('validemail@gmail.com', 'abcdefgh1');

        // check that the numFailedPasswordsSinceLastLogin has reset
        expect(adminUserDetailsHelper(registerResponse.sessionId)).toStrictEqual({
          user: {
            userId: expect.any(Number),
            name: 'Bob Jones',
            email: 'validemail@gmail.com',
            numSuccessfulLogins: 2,
            numFailedPasswordsSinceLastLogin: 0,
          },
        });

        // perform a failed login
        adminAuthLoginHelper('validemail@gmail.com', 'incorrectPassword3');

        // check numFailedPasswordsSinceLastLogin has updated, but successful logins has stayed the same
        expect(adminUserDetailsHelper(registerResponse.sessionId)).toStrictEqual({
          user: {
            userId: expect.any(Number),
            name: 'Bob Jones',
            email: 'validemail@gmail.com',
            numSuccessfulLogins: 2,
            numFailedPasswordsSinceLastLogin: 1,
          },
        });
      }
    });
  });
  describe('testing success cases for adminUserDetailsV2', () => {
    test('testing successful case upon registration', () => {
      const registerResponse = adminAuthRegisterHelper(
        'validemail@gmail.com',
        'abcdefgh1',
        'John',
        'Doe'
      );

      if ('sessionId' in registerResponse) {
        expect(adminUserDetailsV2Helper(registerResponse.sessionId)).toStrictEqual({
          user: {
            userId: expect.any(Number),
            name: 'John Doe',
            email: 'validemail@gmail.com',
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
          },
        });
      }
    });
    test('testing initial value for numSuccessfulLogins', () => {
      const registerResponse = adminAuthRegisterHelper(
        'validemaill@gmail.com',
        'abcdefgh1',
        'John',
        'Dae'
      );

      // initial registration details
      if ('sessionId' in registerResponse) {
        expect(adminUserDetailsV2Helper(registerResponse.sessionId)).toStrictEqual({
          user: {
            userId: expect.any(Number),
            name: 'John Dae',
            email: 'validemaill@gmail.com',
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
          },
        });
      }
    });
    test('testing the numSuccessfulLogins with multiple successful logins', () => {
      const registerResponse = adminAuthRegisterHelper(
        'validemaill@gmail.com',
        'abcdefgh1',
        'John',
        'Dae'
      );

      // perform multiple logins after registration
      adminAuthLoginHelper('validemaill@gmail.com', 'abcdefgh1');
      adminAuthLoginHelper('validemaill@gmail.com', 'abcdefgh1');
      adminAuthLoginHelper('validemaill@gmail.com', 'abcdefgh1');

      // check details after multiple logins
      if ('sessionId' in registerResponse) {
        expect(adminUserDetailsV2Helper(registerResponse.sessionId)).toStrictEqual({
          user: {
            userId: expect.any(Number),
            name: 'John Dae',
            email: 'validemaill@gmail.com',
            numSuccessfulLogins: 4,
            numFailedPasswordsSinceLastLogin: 0,
          },
        });
      }
    });

    test('testing the counter and reset of numFailedPasswordsSinceLastLogin', () => {
      const registerResponse = adminAuthRegisterHelper(
        'validemail@gmail.com',
        'abcdefgh1',
        'Bob',
        'Jones'
      );

      // attempt to login with incorrect password
      if ('sessionId' in registerResponse) {
        adminAuthLoginHelper('validemail@gmail.com', 'incorrectPassword1');
        adminAuthLoginHelper('validemail@gmail.com', 'incorrectPassword2');

        // check details after failed password attempts
        expect(adminUserDetailsV2Helper(registerResponse.sessionId)).toStrictEqual({
          user: {
            userId: expect.any(Number),
            name: 'Bob Jones',
            email: 'validemail@gmail.com',
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 2,
          },
        });

        // perform a successful login
        adminAuthLoginHelper('validemail@gmail.com', 'abcdefgh1');

        // check that the numFailedPasswordsSinceLastLogin has reset
        expect(adminUserDetailsV2Helper(registerResponse.sessionId)).toStrictEqual({
          user: {
            userId: expect.any(Number),
            name: 'Bob Jones',
            email: 'validemail@gmail.com',
            numSuccessfulLogins: 2,
            numFailedPasswordsSinceLastLogin: 0,
          },
        });

        // perform a failed login
        adminAuthLoginHelper('validemail@gmail.com', 'incorrectPassword3');

        // check numFailedPasswordsSinceLastLogin has updated, but successful logins has stayed the same
        expect(adminUserDetailsV2Helper(registerResponse.sessionId)).toStrictEqual({
          user: {
            userId: expect.any(Number),
            name: 'Bob Jones',
            email: 'validemail@gmail.com',
            numSuccessfulLogins: 2,
            numFailedPasswordsSinceLastLogin: 1,
          },
        });
      }
    });
  });
});
