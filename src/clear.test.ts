// This test file is meant to test the clear function in /other.js.

import { expect, test, describe, beforeEach } from '@jest/globals';
import {} from './interface';
import {
  adminAuthRegisterHelper,
  adminQuizCreateHelper,
  clearHelper,
} from './httpHelperFunctions';

beforeEach(() => {
  clearHelper();
});

describe('authLogin', () => {
  describe('success Cases', () => {
    test('registering twice with the same email but separated by clear', () => {
      adminAuthRegisterHelper('a@gmail.com', 'abcdefgh1', 'asd', 'abcde');
      const retcondition: object = clearHelper();
      expect(retcondition).toStrictEqual({});
      const ifError = adminAuthRegisterHelper(
        'a@gmail.com',
        'abcdefgh1',
        'asd',
        'abcde'
      );
      expect(ifError).toStrictEqual({ sessionId: expect.any(Number) });
      clearHelper();
    });
    test('create a quiz with the same name twice.', () => {
      const registerResponse = adminAuthRegisterHelper(
        'a@gmail.com',
        'abcdefgh1',
        'asd',
        'abcde'
      );

      if ('sessionId' in registerResponse) {
        adminQuizCreateHelper(registerResponse.sessionId, 'hello Quiz', 'none');
        expect(clearHelper()).toStrictEqual({});

        const registerResponseAfter = adminAuthRegisterHelper(
          'a@gmail.com',
          'abcdefgh1',
          'asd',
          'abcde'
        );

        if ('sessionId' in registerResponseAfter) {
          console.log(registerResponseAfter);
          const returncondition: object = adminQuizCreateHelper(
            registerResponseAfter.sessionId,
            'hello Quiz',
            'none'
          );
          expect(returncondition).toStrictEqual({ quizId: expect.any(Number) });
          clearHelper();
        }
      }
    });
  });
});

// this is more or less the only tests we could do due to how simple the clear function is.
