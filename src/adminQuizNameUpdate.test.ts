import { describe, expect, test, beforeEach } from '@jest/globals';
import {
  clearHelper,
  adminQuizNameUpdateHelper,
  adminAuthRegisterHelper,
  adminQuizInfoHelper,
  adminQuizCreateHelper,
} from './httpHelperFunctions';

describe('QuizNameUpdate', () => {
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
      adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, validName);
      adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, validName);

      const info = adminQuizInfoHelper(validSessionUserId1, validQuizId1);
      if ('name' in info) {
        expect(info.name).toStrictEqual(validName);
      }
    });
  });

  describe('Failure Cases', () => {
    test('sessionId not valid, all other parameters valid', () => {
      expect(adminQuizNameUpdateHelper(invalidSessionId, validQuizId1, validName)
      ).toStrictEqual({ error: 'invalid Token' });
    });

    test('quizId not valid, all other parameters valid', () => {
      expect(
        adminQuizNameUpdateHelper(validSessionUserId1, invalidQuizId, validName)
      ).toStrictEqual({ error: 'provided quizId is not a real quiz.' });
    });

    test('quizId valid, but not owned by user provided by sessionId, all other parementers valid', () => {
      expect(
        adminQuizNameUpdateHelper(validSessionUserId2, validQuizId1, validName)
      ).toStrictEqual({
        error: 'User does not own quiz',
      });
    });

    test('no name, all other parameters valid', () => {
      expect(
        adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, '')
      ).toStrictEqual({ error: 'name is invalid.' });
    });

    test('name contains none alphanumeric and space characters, all other parameters valid', () => {
      expect(
        adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, invalidName1)
      ).toStrictEqual({ error: 'name is invalid.' });
    });

    test('name is < 3 characters long, all other parameters valid', () => {
      expect(
        adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, invalidName2)
      ).toStrictEqual({ error: 'name is invalid.' });
    });

    test('name is > 30 characters long, all other parameters valid', () => {
      expect(
        adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, invalidName3)
      ).toStrictEqual({ error: 'name is invalid.' });
    });

    test('name valid but already in use for another quiz, all other parameters valid', () => {
      expect(
        adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, 'Games')
      ).toStrictEqual({ error: 'name is being used for another quiz.' });
    });

    test('name the same as current name, all other parameters valid', () => {
      expect(
        adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, 'Games')
      ).toStrictEqual({ error: 'name is being used for another quiz.' });
    });

    test('name not changed', () => {
      adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, invalidName1);

      const info = adminQuizInfoHelper(validSessionUserId1, validQuizId1);
      if ('name' in info) {
        expect(info.name).not.toStrictEqual(invalidName1);
      }
    });

    test('time not changed', () => {
      const info = adminQuizInfoHelper(validSessionUserId1, validQuizId1);

      adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, invalidName1);
      adminQuizNameUpdateHelper(validSessionUserId1, validQuizId1, invalidName1);

      if ('timeLastEdited' in info) {
        const info2 = adminQuizInfoHelper(validSessionUserId1, validQuizId1);
        if ('timeLastEdited' in info2) {
          expect(info2.timeLastEdited).toStrictEqual(info.timeLastEdited);
        }
      }
    });
  });
});
