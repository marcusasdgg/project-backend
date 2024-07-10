import { describe, expect, test, beforeEach } from '@jest/globals';
import {
  clearHelper,
  adminAuthRegisterHelper,
  adminQuizNameUpdateHelper,
  adminQuizDescriptionUpdateHelper,
  adminQuizInfoHelper,
  adminQuizCreateHelper,
  adminQuizRemoveHelper,
  adminQuizRestoreHelper,
} from './httpHelperFunctions';

describe('adminQuizInfo', () => {
  let sessionId: number;
  let quizId: number;
  let sessionId1: number;
  let quizMinId: number;
  let quizMaxId: number;

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

    const registerResponse1 = adminAuthRegisterHelper(
      'user2@tookah.com',
      'Goodpasswordgood2',
      'Super',
      'Superman'
    );

    if ('sessionId' in registerResponse1) {
      sessionId1 = registerResponse1.sessionId;
    }

    const quizCreateResponse = adminQuizCreateHelper(
      sessionId,
      'Cards',
      'Good game of thirteen'
    );

    if ('quizId' in quizCreateResponse) {
      quizId = quizCreateResponse.quizId;
    }

    const quizCreateResponse1 = adminQuizCreateHelper(sessionId, 'Hue', 'i');

    if ('quizId' in quizCreateResponse1) {
      quizMinId = quizCreateResponse1.quizId;
    }
    const quizCreateResponse2 = adminQuizCreateHelper(
      sessionId,
      'Legend of the Ancient Kingdoms',
      'Embark on an epic adventure to uncover ancient secrets and save the kingdom from impending darkness.'
    );

    if ('quizId' in quizCreateResponse2) {
      quizMaxId = quizCreateResponse2.quizId;
    }
  });

  describe('Successsful Cases', () => {
    test('valid sessionId, valid quizId', () => {
      expect(adminQuizInfoHelper(sessionId, quizId)).toStrictEqual({
        quizId: quizId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        questions: expect.any(Array),
        timeLastEdited: expect.any(Number),
        description: 'Good game of thirteen',
      });
    });

    test('min values', () => {
      expect(adminQuizInfoHelper(sessionId, quizMinId)).toStrictEqual({
        quizId: quizMinId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        questions: expect.any(Array),
        timeLastEdited: expect.any(Number),
        description: 'i',
      });
    });

    test('max values', () => {
      expect(adminQuizInfoHelper(sessionId, quizMaxId)).toStrictEqual({
        quizId: quizMaxId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        questions: expect.any(Array),
        timeLastEdited: expect.any(Number),
        description:
          'Embark on an epic adventure to uncover ancient secrets and save the kingdom from impending darkness.',
      });
    });

    test('quiz info on removed quiz', () => {
      adminQuizRemoveHelper(sessionId, quizId);
      expect(adminQuizInfoHelper(sessionId, quizId)).toStrictEqual({
        error: expect.any(String),
      });
    });

    test('check if quizEdit is working properly with adminQuizDescriptionUpdate', () => {
      adminQuizDescriptionUpdateHelper(sessionId, quizId, 'im not happy :(');
      adminQuizDescriptionUpdateHelper(sessionId, quizId, 'im happy now :)');
      expect(adminQuizInfoHelper(sessionId, quizId)).toStrictEqual({
        quizId: quizId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        questions: expect.any(Array),
        timeLastEdited: expect.any(Number),
        description: 'im happy now :)',
      });
    });

    test('check if quizEdit is working properly with adminQuizNameUpdate', () => {
      adminQuizNameUpdateHelper(sessionId, quizId, 'no');
      adminQuizNameUpdateHelper(sessionId, quizId, 'yes');
      expect(adminQuizInfoHelper(sessionId, quizId)).toStrictEqual({
        quizId: quizId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        questions: expect.any(Array),
        timeLastEdited: expect.any(Number),
        description: 'Good game of thirteen',
      });
    });

    test('viewing quiz after restore', () => {
      adminQuizRemoveHelper(sessionId, quizId);
      adminQuizRestoreHelper(sessionId, quizId);
      expect(adminQuizInfoHelper(sessionId, quizId)).toStrictEqual({
        quizId: quizId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        questions: expect.any(Array),
        timeLastEdited: expect.any(Number),
        description: 'Good game of thirteen',
      });
    });
  });

  describe('Failure Cases', () => {
    test('Invalid sessionID, Invalid quizID', () => {
      const invalidSessionId = sessionId + sessionId1 + 1;
      const invalidQuizId = quizId + quizMaxId + 1;
      expect(
        adminQuizInfoHelper(invalidSessionId, invalidQuizId)
      ).toStrictEqual({
        error: expect.any(String),
      });
    });

    test('Invalid sessionID, valid quizID', () => {
      const invalidSessionId = sessionId + sessionId1 + 1;
      expect(adminQuizInfoHelper(invalidSessionId, quizId)).toStrictEqual({
        error: expect.any(String),
      });
    });

    test('Valid sessionID, Invalid quizID', () => {
      const invalidQuizId = quizId + quizMaxId + 1;
      expect(adminQuizInfoHelper(sessionId, invalidQuizId)).toStrictEqual({
        error: expect.any(String),
      });
    });

    test('Valid quizID, not owned by sessionId', () => {
      expect(adminQuizInfoHelper(sessionId1, quizId)).toStrictEqual({
        error: expect.any(String),
      });
    });
  });
});
