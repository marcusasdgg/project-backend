
import { expect, test, describe, beforeEach } from '@jest/globals';
import { adminAuthRegisterHelper, adminUserDetailsHelper, adminUserDetailsUpdateHelper, clearHelper, adminUserDetailsUpdateV2Helper } from './httpHelperFunctions';
import { register } from 'module';

describe('admin UserDetailsUpdate', () => {
  beforeEach(() => {
    clearHelper();
  });

  describe('success cases', () => {
    test('general checking if authid has fields changed.', () => {
      const registerResponse = adminAuthRegisterHelper(
        'john@gmail.com',
        'John12345678910',
        'John',
        'Smith'
      );

      if ('sessionId' in registerResponse) {
        const userId = registerResponse.sessionId;
        console.log(userId);
        expect(
          adminUserDetailsUpdateHelper(userId, 'john@gmail.com', 'John', 'Smith')
        ).not.toStrictEqual({ error: expect.any(String) });
        const user = adminUserDetailsHelper(userId);

        if ('user' in user) {
          const fullName: string = user.user.name;
          const email: string = user.user.email;
          expect(fullName).toStrictEqual('John Smith');
          expect(email).toStrictEqual('john@gmail.com');
        }
      }
    });

    test('update details but do not change anything.', () => {
      const registerResponse = adminAuthRegisterHelper(
        'john@gmail.com',
        'John12345678910',
        'John',
        'Smith'
      );

      if ('sessionId' in registerResponse) {
        const userId = registerResponse.sessionId;
        expect(
          adminUserDetailsUpdateHelper(userId, 'john@gmail.com', 'John', 'Smith')
        ).not.toStrictEqual({ error: expect.any(String) });

        const user = adminUserDetailsHelper(userId);

        if ('user' in user) {
          const fullName: string = user.user.name;
          const email: string = user.user.email;
          expect(fullName).toStrictEqual('John Smith');
          expect(email).toStrictEqual('john@gmail.com');
        }
      }
    });
  });

  describe('failure cases', () => {
    test('AuthId is not valid', () => {
      const token = adminAuthRegisterHelper('john@gmail.com', 'John12345678', 'John', 'Smith');
      if ('sessionId' in token) {
        expect(
          adminUserDetailsUpdateHelper(token.sessionId, 'john@gmail.com', 'John', 'Smith')
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('email is not valid', () => {
      const registerResponse = adminAuthRegisterHelper(
        'john@gmail.com',
        'John12345678',
        'John',
        'Smith'
      );

      if ('sessionId' in registerResponse) {
        expect(
          adminUserDetailsUpdateHelper(
            registerResponse.sessionId,
            'a@.com',
            'John',
            'Smith'
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('email is used by other user', () => {
      const registerResponse = adminAuthRegisterHelper(
        'john@gmail.com',
        'John12345678',
        'John',
        'Smith'
      );

      if ('sessionId' in registerResponse) {
        adminAuthRegisterHelper('lowJ@gmail.com', 'John12345678', 'John', 'Smoth');
        expect(
          adminUserDetailsUpdateHelper(
            registerResponse.sessionId,
            'lowJ@gmail.com',
            'John',
            'Smith'
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('namefirst contains invalid characters', () => {
      const registerResponse = adminAuthRegisterHelper(
        'john@gmail.com',
        'John12345678',
        'John',
        'Smith'
      );
      if ('sessionId' in registerResponse) {
        expect(
          adminUserDetailsUpdateHelper(
            registerResponse.sessionId,
            'john@gmail.com',
            'John1',
            'Smith'
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('namelast contains invalid characters', () => {
      const registerResponse = adminAuthRegisterHelper(
        'john@gmail.com',
        'John12345678',
        'John',
        'Smith1'
      );
      if ('sessionId' in registerResponse) {
        expect(
          adminUserDetailsUpdateHelper(
            registerResponse.sessionId,
            'john@gmail.com',
            'John1',
            'Smith'
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('namefirst is 1 character', () => {
      const registerResponse = adminAuthRegisterHelper(
        'john@gmail.com',
        'John12345678',
        'J',
        'Smith'
      );
      if ('sessionId' in registerResponse) {
        expect(
          adminUserDetailsUpdateHelper(
            registerResponse.sessionId,
            'john@gmail.com',
            'John1',
            'Smith'
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('namefirst is more than 20 characters', () => {
      const registerResponse = adminAuthRegisterHelper(
        'john@gmail.com',
        'John12345678',
        'abcdefghijklmnopqrstuvwxyz',
        'Smith'
      );
      if ('sessionId' in registerResponse) {
        expect(
          adminUserDetailsUpdateHelper(
            registerResponse.sessionId,
            'john@gmail.com',
            'John1',
            'Smith'
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('namelast is more than 20 characters', () => {
      const registerResponse = adminAuthRegisterHelper(
        'john@gmail.com',
        'John12345678',
        'John',
        'abcdefghijklmnopqrstuvwxyz'
      );
      if ('sessionId' in registerResponse) {
        expect(
          adminUserDetailsUpdateHelper(
            registerResponse.sessionId,
            'john@gmail.com',
            'John1',
            'Smith'
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('namelast is less than 2 character', () => {
      const registerResponse = adminAuthRegisterHelper(
        'john@gmail.com',
        'John12345678',
        'John',
        'a'
      );
      if ('sessionId' in registerResponse) {
        expect(
          adminUserDetailsUpdateHelper(
            registerResponse.sessionId,
            'john@gmail.com',
            'John1',
            'Smith'
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });
  });
  describe('V2 general Tests', () => {
    test('invalid token 401', () => {
      const registerResponse = adminAuthRegisterHelper(
        'john@gmail.com',
        'John12345678',
        'John',
        'Smith'
      );
      if ('sessionId' in registerResponse) {
        expect(
          adminUserDetailsUpdateV2Helper(registerResponse.sessionId + 1, 'john@gmail.com', 'John', 'Smith')
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('general checking if authid has fields changed.', () => {
      const registerResponse = adminAuthRegisterHelper(
        'john@gmail.com',
        'John12345678910',
        'John',
        'Smith'
      );

      if ('sessionId' in registerResponse) {
        const userId = registerResponse.sessionId;
        console.log(userId);
        expect(
          adminUserDetailsUpdateV2Helper(userId, 'john@gmail.com', 'John', 'Smith')
        ).not.toStrictEqual({ error: expect.any(String) });
        const user = adminUserDetailsHelper(userId);

        if ('user' in user) {
          const fullName: string = user.user.name;
          const email: string = user.user.email;
          expect(fullName).toStrictEqual('John Smith');
          expect(email).toStrictEqual('john@gmail.com');
        }
      }
    });


  }); 
});
