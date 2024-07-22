import { describe, expect, test, beforeEach } from '@jest/globals';
import {
  clearHelper,
  adminQuizNameUpdateHelper,
  adminQuizNameUpdateHelperV2,
  adminAuthRegisterHelper,
  adminQuizInfoHelper,
  adminQuizCreateHelper,
} from './httpHelperFunctions';

describe('QuizNameUpdate', () => {
  describe('V1', () => {
    let validSessionUserId1: number;
    let validSessionUserId2: number;
    let validQuizId1: number;
    let validQuizId2: number;
    let invalidSessionId: number;
    let invalidQuizId: number;

    const validName: string = 'Numbers';
    const extremeValidName1: string = 'fun';
    const extremeValidName2: string = '1Very Extreme Name For a Quiz1';

    const invalidName1: string = 'Almost a valid Name...';
    const invalidName2: string = 'fu';
    const invalidName3: string = '10Very Extreme Name For a Quiz01';

    beforeEach(() => {
      clearHelper();

      const registerResponse1 = adminAuthRegisterHelper('user1@tookah.com', 'iL0veT00kah', 'Brian', 'Bones');

      if ('sessionId' in registerResponse1) {
        validSessionUserId1 = registerResponse1.sessionId;
      }

      const registerResponse2 = adminAuthRegisterHelper('user2@tookah.com', 'iLHateT00kah', 'Bob', 'Jones');

      if ('sessionId' in registerResponse2) {
        validSessionUserId2 = registerResponse2.sessionId;
      }

      const quizCreateResponse1 = adminQuizCreateHelper(validSessionUserId1, 'Games', 'Game Trivia!');

      if ('quizId' in quizCreateResponse1) {
        validQuizId1 = quizCreateResponse1.quizId;
      }

      const quizCreateResponse2 = adminQuizCreateHelper(validSessionUserId1, 'Fruit or Cake', 'Is it a fruit or cake?');

      if ('quizId' in quizCreateResponse2) {
        validQuizId2 = quizCreateResponse2.quizId;
      }

      invalidSessionId = validSessionUserId1 + validSessionUserId2 + 1;
      invalidQuizId = validQuizId1 + validQuizId2 + 1;
    });

    describe('Success Cases', () => {
      test('all parameters valid', () => {
        expect(
          adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, validName)
        ).toStrictEqual({});
      });

      test('name is = 3 characters long, all other parameters valid', () => {
        expect(
          adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, extremeValidName1)
        ).toStrictEqual({});
      });

      test('name is = 30 characters long, all other parameters valid', () => {
        expect(
          adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, extremeValidName2)
        ).toStrictEqual({});
      });

      test('name changed', () => {
        expect(adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, validName)).not.toStrictEqual({ error: expect.any(String) });
        expect(adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, validName)).toStrictEqual({ error: expect.any(String) });

        const info = adminQuizInfoHelper(validSessionUserId1, validQuizId1);
        if ('name' in info) {
          expect(info.name).toStrictEqual(validName);
        }
      });
    });

    describe('Failure Cases', () => {
      test('sessionId not valid, all other parameters valid', () => {
        expect(
          adminQuizNameUpdateHelper(invalidSessionId, validQuizId1, validName)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('quizId not valid, all other parameters valid', () => {
        expect(
          adminQuizNameUpdateHelper(validSessionUserId1, invalidQuizId, validName)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('quizId valid, but not owned by user provided by sessionId, all other parementers valid', () => {
        expect(
          adminQuizNameUpdateHelper(validSessionUserId2, validQuizId1, validName)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('no name, all other parameters valid', () => {
        expect(
          adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, '')
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('name contains none alphanumeric and space characters, all other parameters valid', () => {
        expect(
          adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, invalidName1)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('name is < 3 characters long, all other parameters valid', () => {
        expect(
          adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, invalidName2)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('name is > 30 characters long, all other parameters valid', () => {
        expect(
          adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, invalidName3)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('name valid but already in use for another quiz, all other parameters valid', () => {
        expect(
          adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, 'Games')
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('name the same as current name, all other parameters valid', () => {
        expect(
          adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, 'Games')
        ).toStrictEqual({ error: expect.any(String) });
      });
    });
  });

  describe('V2', () => {
    let validSessionUserId1: number;
    let validSessionUserId2: number;
    let validQuizId1: number;
    let validQuizId2: number;
    let invalidSessionId: number;
    let invalidQuizId: number;

    const validName: string = 'Numbers';

    const invalidName1: string = 'Almost a valid Name...';

    beforeEach(() => {
      clearHelper();

      const registerResponse1 = adminAuthRegisterHelper('user1@tookah.com', 'iL0veT00kah', 'Brian', 'Bones');

      if ('sessionId' in registerResponse1) {
        validSessionUserId1 = registerResponse1.sessionId;
      }

      const registerResponse2 = adminAuthRegisterHelper('user2@tookah.com', 'iLHateT00kah', 'Bob', 'Jones');

      if ('sessionId' in registerResponse2) {
        validSessionUserId2 = registerResponse2.sessionId;
      }

      const quizCreateResponse1 = adminQuizCreateHelper(validSessionUserId1, 'Games', 'Game Trivia!');

      if ('quizId' in quizCreateResponse1) {
        validQuizId1 = quizCreateResponse1.quizId;
      }

      const quizCreateResponse2 = adminQuizCreateHelper(validSessionUserId1, 'Fruit or Cake', 'Is it a fruit or cake?');

      if ('quizId' in quizCreateResponse2) {
        validQuizId2 = quizCreateResponse2.quizId;
      }

      invalidSessionId = validSessionUserId1 + validSessionUserId2 + 1;
      invalidQuizId = validQuizId1 + validQuizId2 + 1;
    });

    describe('Success Cases', () => {
      test('all parameters valid', () => {
        expect(
          adminQuizNameUpdateHelperV2(validSessionUserId1, validQuizId1, validName)
        ).toStrictEqual({});
      });
    });

    describe('Failure Cases', () => {
      test('sessionId not valid, all other parameters valid', () => {
        expect(
          adminQuizNameUpdateHelperV2(invalidSessionId, validQuizId1, validName)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('quizId not valid, all other parameters valid', () => {
        expect(
          adminQuizNameUpdateHelperV2(validSessionUserId1, invalidQuizId, validName)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('quizId valid, but not owned by user provided by sessionId, all other parementers valid', () => {
        expect(
          adminQuizNameUpdateHelperV2(validSessionUserId2, validQuizId1, validName)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('name contains none alphanumeric and space characters, all other parameters valid', () => {
        expect(
          adminQuizNameUpdateHelperV2(validSessionUserId1, validQuizId1, invalidName1)
        ).toStrictEqual({ error: expect.any(String) });
      });
    });
  });
});
