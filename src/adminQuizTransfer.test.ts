import { describe, expect, test, beforeEach } from '@jest/globals';
import {
  clearHelper,
  adminAuthRegisterHelper,
  adminQuizCreateHelper,
  adminQuizTransferHelper,
} from './httpHelperFunctions';

describe('adminQuizTransfer', () => {
  let sessionId: number;
  let sessionId2: number;
  beforeEach(() => {
    clearHelper();
    const registerResponse = adminAuthRegisterHelper(
      'user1@tookah.com',
      'Password123',
      'Bat',
      'Batman'
    );
    if ('sessionId' in registerResponse) {
      sessionId = registerResponse.sessionId;
    }
    const registerResponse2 = adminAuthRegisterHelper(
      'user2@tookah.com',
      'Passwordx123',
      'John',
      'Davies'
    );
    if ('sessionId' in registerResponse2) {
      sessionId2 = registerResponse2.sessionId;
    }
  });
  describe('Testing failure cases', () => {
    test("Recipient's email is invalid", () => {
      const quizId = adminQuizCreateHelper(
        sessionId,
        'Kelly',
        'Kelly Kills Keys'
      );
      if ('quizId' in quizId) {
        expect(
          adminQuizTransferHelper(sessionId, quizId.quizId, 'user4@tookah.com')
        ).toStrictEqual({
          error: expect.any(String),
        });
      }
    });
    test('Recipient email is the currently logged in user', () => {
      const quizId = adminQuizCreateHelper(
        sessionId,
        'Kelly',
        'Kelly Kills Keys'
      );
      if ('quizId' in quizId) {
        expect(
          adminQuizTransferHelper(sessionId, quizId.quizId, 'user1@tookah.com')
        ).toStrictEqual({
          error: expect.any(String),
        });
      }
    });
    test('Invalid sessionId', () => {
      const quizId = adminQuizCreateHelper(
        sessionId,
        'Kelly',
        'Kelly Kills Keys'
      );
      if ('quizId' in quizId) {
        expect(
          adminQuizTransferHelper(
            sessionId + 5,
            quizId.quizId,
            'user2@tookah.com'
          )
        ).toStrictEqual({
          error: expect.any(String),
        });
      }
    });
    test('Valid token, but is not owner of quiz', () => {
      const quizId = adminQuizCreateHelper(
        sessionId,
        'Kelly',
        'Kelly Kills Keys'
      );
      const quizId2 = adminQuizCreateHelper(
        sessionId2,
        'Batmobile',
        'Batman will jump'
      );
      if ('quizId' in quizId && 'quizId' in quizId2) {
        expect(
          adminQuizTransferHelper(sessionId, quizId2.quizId, 'user2@tookah.com')
        ).toStrictEqual({
          error: expect.any(String),
        });
      }
    });
    test('Valid token, but quiz does not exist', () => {
      const quizId = adminQuizCreateHelper(
        sessionId,
        'Kelly',
        'Kelly Kills Keys'
      );
      if ('quizId' in quizId) {
        expect(
          adminQuizTransferHelper(
            sessionId,
            quizId.quizId + 5,
            'user2@tookah.com'
          )
        ).toStrictEqual({
          error: expect.any(String),
        });
      }
    });
    test('QuizId name is already being used by target user', () => {
      const quizId = adminQuizCreateHelper(
        sessionId,
        'Kelly',
        'Kelly Kills Keys'
      );
      const quizId2 = adminQuizCreateHelper(
        sessionId2,
        'Kelly',
        'Batman will jump'
      );
      if ('quizId' in quizId && 'quizId' in quizId2) {
        expect(
          adminQuizTransferHelper(sessionId, quizId.quizId, 'user2@tookah.com')
        ).toStrictEqual({
          error: expect.any(String),
        });
      }
    });
  });
  describe('Testing success cases', () => {
    test('Successful transfer of quiz', () => {
      // create quiz, transfer it to another user
      const quizId = adminQuizCreateHelper(
        sessionId,
        'Kelly',
        'Kelly Kills Keys'
      );
      const quizId2 = adminQuizCreateHelper(
        sessionId2,
        'Batman',
        'Batman will jump'
      );
      if ('quizId' in quizId && 'quizId' in quizId2) {
        expect(
          adminQuizTransferHelper(
            sessionId,
            quizId.quizId,
            'user2@tookah.com'
          )
        ).toStrictEqual({});
      }
    });
  });
});
