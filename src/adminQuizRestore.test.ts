import { describe, expect, test, beforeEach } from '@jest/globals';
import { clearHelper, adminQuizRestoreHelper, adminAuthRegisterHelper, adminQuizCreateHelper, adminQuizRemoveHelper } from './httpHelperFunctions';

describe('adminQuizRestore', () => {
  let sessionId: number;
  beforeEach(() => {
    clearHelper();
    const registerResponse = adminAuthRegisterHelper('user1@tookah.com', 'Password123', 'Bat', 'Batman');
    if ('sessionId' in registerResponse) {
      sessionId = registerResponse.sessionId;
    }
  });
  describe('Testing failure cases', () => {
    test('Invalid sessionId, Invalid quizId', () => {
      const quizId = adminQuizCreateHelper(sessionId, 'Kelly', 'Kelly Kills Keys');
      if ('quizId' in quizId) {
        expect(adminQuizRestoreHelper(sessionId + 5, quizId.quizId + 5)).toStrictEqual({
          error: expect.any(String),
        });
      }
    });

    test('Valid sessionId, Invalid quizId', () => {
      const quizId = adminQuizCreateHelper(sessionId, 'Kelly', 'Kelly Kills Keys');
      if ('quizId' in quizId) {
        expect(adminQuizRestoreHelper(sessionId, quizId.quizId + 5)).toStrictEqual({
          error: expect.any(String),
        });
      }
    });

    test('Valid quizId, but is not owned by sessionId', () => {
      const quizId = adminQuizCreateHelper(sessionId, 'Kelly', 'Kelly Kills Keys');
      const sessionId1 = adminAuthRegisterHelper(
        'user1@tookah.com',
        'Password1234',
        'John',
        'Jamie'
      );
      if ('sessionId' in sessionId1 && 'quizId' in quizId) {
        expect(adminQuizRestoreHelper(sessionId1.sessionId, quizId.quizId)).toStrictEqual({
          error: expect.any(String),
        });
      }
    });

    test('QuizId is already used by another active quiz', () => {
      const quizId1 = adminQuizCreateHelper(sessionId, 'Kelly', 'Kelly koalas');
      const sessionId1 = adminAuthRegisterHelper('user2@tookah.com', 'Password1234', 'John', 'Jamie');
      if ('sessionId' in sessionId1) {
        const quizId2 = adminQuizCreateHelper(sessionId1.sessionId, 'Kelly', 'Kelly Kills Keys');
        if ('quizId' in quizId1 && 'quizId' in quizId2) {
          adminQuizRemoveHelper(sessionId, quizId1.quizId);
          expect(adminQuizRestoreHelper(sessionId, quizId1.quizId)).toStrictEqual({
            error: expect.any(String),
          });
        }
      }
    });
    test('QuizId is not in trash', () => {
      const quizId = adminQuizCreateHelper(sessionId, 'Kelly', 'Kelly Kills Keys');
      if ('quizId' in quizId) {
        expect(adminQuizRestoreHelper(sessionId, quizId.quizId)).toStrictEqual({
          error: expect.any(String),
        });
      }
    });
  });
  describe('Testing success cases', () => {
    test('Successful quiz restore', () => {
      const quizId = adminQuizCreateHelper(sessionId, 'Kelly', 'Kelly Kills Keys');
      if ('quizId' in quizId) {
        adminQuizRemoveHelper(sessionId, quizId.quizId);
        expect(adminQuizRestoreHelper(sessionId, quizId.quizId)).toStrictEqual({});
      }
    });
  });
});
