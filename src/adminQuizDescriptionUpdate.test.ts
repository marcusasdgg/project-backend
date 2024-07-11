import { describe, expect, test, beforeEach } from '@jest/globals';
import {
  clearHelper,
  adminQuizDescriptionUpdateHelper,
  adminAuthRegisterHelper,
  adminQuizCreateHelper,
  adminQuizInfoHelper,
} from './httpHelperFunctions';

describe('QuizDescriptionUpdate', () => {
  let validSessionId1: number;
  let validSessionId2: number;
  let validQuizId: number;

  const validDescription: string = 'This description is 38 characters long';
  const extremeValidDescription: string =
    'This is a new description for this reeally fun Tookah quiz for' +
    'comp1511 students to start attending.';

  let invalidSessionId: number = -134534;
  let invalidQuizId: number = -133753;
  const invalidDescription: string =
    'This is a newer description for this really fun Tookah quiz for students to start attending lectures hahahah.';

  beforeEach(() => {
    clearHelper();

    const registerResponse1 = adminAuthRegisterHelper('user1@tookah.com', 'iL0veT00kah', 'Brian', 'Bones');

    if ('sessionId' in registerResponse1) {
      validSessionId1 = registerResponse1.sessionId;
    }

    const registerResponse2 = adminAuthRegisterHelper('user2@tookah.com', 'iLHateT00kah', 'Bob', 'Jones');

    if ('sessionId' in registerResponse2) {
      validSessionId2 = registerResponse2.sessionId;
    }

    const quizCreateResponse = adminQuizCreateHelper(validSessionId1, 'Games', 'Game Trivia!');

    if ('quizId' in quizCreateResponse) {
      validQuizId = quizCreateResponse.quizId;
    }

    invalidSessionId = validSessionId1 + validSessionId2 + 1;
    invalidQuizId = validQuizId + 1;
  });

  describe('Success Cases', () => {
    test('all parameters valid', () => {
      expect(
        adminQuizDescriptionUpdateHelper(
          validSessionId1,
          validQuizId,
          validDescription
        )
      ).toStrictEqual({});
    });

    test('description length = 100, all other parementers valid', () => {
      expect(
        adminQuizDescriptionUpdateHelper(validSessionId1, validQuizId, extremeValidDescription)
      ).toStrictEqual({});
    });

    test('description length = 0, all other parementers valid', () => {
      expect(
        adminQuizDescriptionUpdateHelper(validSessionId1, validQuizId, '')
      ).toStrictEqual({});
    });

    test('description changed', () => {
      adminQuizDescriptionUpdateHelper(validSessionId1, validQuizId, validDescription);

      const info = adminQuizInfoHelper(validSessionId1, validQuizId);
      if ('description' in info) {
        expect(info.description).toStrictEqual(validDescription);
      }
    });
  });

  describe('Failure Cases', () => {
    test('sessionId not valid all other parementers valid', () => {
      expect(
        adminQuizDescriptionUpdateHelper(invalidSessionId, validQuizId, validDescription)
      ).toStrictEqual({ error: 'invalid Token' });
    });

    test('quizId not valid all other parementers valid', () => {
      expect(
        adminQuizDescriptionUpdateHelper(validSessionId1, invalidQuizId, validDescription)
      ).toStrictEqual({ error: 'provided quizId is not a real quiz.' });
    });

    test('quizId valid but not owned by user provided by sessionId all other parementers valid', () => {
      expect(
        adminQuizDescriptionUpdateHelper(validSessionId2, validQuizId, validDescription)
      ).toStrictEqual({
        error: 'User does not own quiz',
      });
    });

    test('description length > 100, all other parementers valid', () => {
      expect(
        adminQuizDescriptionUpdateHelper(validSessionId1, validQuizId, invalidDescription)
      ).toStrictEqual({ error: 'description is invalid.' });
    });

    test('all parameters are invalid', () => {
      expect(
        adminQuizDescriptionUpdateHelper(invalidSessionId, invalidQuizId, invalidDescription)
      ).toStrictEqual({ error: 'invalid Token' });
    });

    test('sessionId is valid, all other parementers invalid', () => {
      expect(
        adminQuizDescriptionUpdateHelper(validSessionId1, invalidQuizId, invalidDescription)
      ).toStrictEqual({ error: 'provided quizId is not a real quiz.' });
    });

    test('quizId is valid, all other parementers invalid', () => {
      expect(
        adminQuizDescriptionUpdateHelper(invalidSessionId, validQuizId, invalidDescription)
      ).toStrictEqual({ error: 'invalid Token' });
    });

    test('description is valid, all other parementers invalid', () => {
      expect(
        adminQuizDescriptionUpdateHelper(invalidSessionId, invalidQuizId, validDescription)
      ).toStrictEqual({ error: 'invalid Token' });
    });

    test('description not changed', () => {
      adminQuizDescriptionUpdateHelper(validSessionId1, validQuizId, invalidDescription);

      const info = adminQuizInfoHelper(validSessionId1, validQuizId);
      if ('description' in info) {
        expect(info.description).not.toStrictEqual(invalidDescription);
      }
    });

    test('time not changed', () => {
      const info = adminQuizInfoHelper(validSessionId1, validQuizId);

      adminQuizDescriptionUpdateHelper(validSessionId1, validQuizId, invalidDescription);

      if ('timeLastEdited' in info) {
        const info2 = adminQuizInfoHelper(validSessionId1, validQuizId);
        if ('timeLastEdited' in info2) {
          expect(info2.timeLastEdited).toStrictEqual(info.timeLastEdited);
        }
      }
    });
  });
});
