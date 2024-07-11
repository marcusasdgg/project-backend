import { describe, expect, test, beforeEach } from '@jest/globals';
import {
  clearHelper,
  adminAuthRegisterHelper,
  adminQuizRestoreHelper,
  adminQuizCreateHelper,
  adminQuizRemoveHelper,
  adminQuizTrashListHelper
} from './httpHelperFunctions';

describe('adminQuizTrash', () => {
  let sessionId: number;
  let quizId: number;
  let quizId1: number;
  let invalidSessionId: number;

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
      quizId1 = quizCreateResponse1.quizId;
    }

    adminQuizRemoveHelper(sessionId, quizId);
    adminQuizRemoveHelper(sessionId, quizId1);

    invalidSessionId = sessionId + 1;
  });

  describe('Successsful Cases', () => {
    test('view quizzes after deletion successfully', () => {
      expect(adminQuizTrashListHelper(sessionId)).toStrictEqual({
        quizzes: expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            quizId: expect.any(Number)
          }),
          expect.objectContaining({
            name: expect.any(String),
            quizId: expect.any(Number)
          })
        ])
      });
    });

    test('view quizzes after successful restore', () => {
      adminQuizRestoreHelper(sessionId, quizId1);
      expect(adminQuizTrashListHelper(sessionId)).toStrictEqual({
        quizzes: expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            quizId: expect.any(Number)
          }),
        ])
      });
    });
  });

  describe('Failure Cases', () => {
    test('token is invalid (does not refer to valid logged in user session)', () => {
      expect(adminQuizTrashListHelper(invalidSessionId)).toStrictEqual({ error: expect.any(String) });
    });
  });
});
