import { describe, expect, test, beforeEach } from '@jest/globals';
import { 
  clearHelper, 
  adminAuthRegisterHelper, 
  adminQuizListHelper, 
  adminQuizCreateHelper, 
  adminQuizRemoveHelper,
  adminQuizRemoveV2Helper
} from './httpHelperFunctions';
import { quiz } from './interface';

describe('adminQuizRemove', () => {
  let sessionId: number;

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
  });

  describe('Successsful Cases', () => {
    test('removed one quiz successfully', () => {
      const quizId = adminQuizCreateHelper(sessionId, 'Kelly', 'Kelly Kills Keys');

      if ('quizId' in quizId) {
        expect(adminQuizRemoveHelper(sessionId, quizId.quizId)).toStrictEqual({});
        const quizList = adminQuizListHelper(sessionId);
        if ('quizzes' in quizList) {
          expect(
            quizList.quizzes.find((quiz: quiz) => quiz.quizId === quizId.quizId)
          ).toStrictEqual(undefined);
        }
      }
    });

    test('removed two quizes successfully', () => {
      const quizId = adminQuizCreateHelper(sessionId, 'Kelly', 'Kelly Kills Keys');
      const quizId1 = adminQuizCreateHelper(sessionId, 'Bill', 'Kill Bill Kill');
      if ('quizId' in quizId && 'quizId' in quizId1) {
        expect(adminQuizRemoveHelper(sessionId, quizId.quizId)).toStrictEqual({});

        const quizList = adminQuizListHelper(sessionId);
        if ('quizzes' in quizList) {
          expect(
            quizList.quizzes.find((quiz: quiz) => quiz.quizId === quizId.quizId)
          ).toStrictEqual(undefined);
        }

        expect(adminQuizRemoveHelper(sessionId, quizId1.quizId)).toStrictEqual({});
        const quizList1 = adminQuizListHelper(sessionId);
        if ('quizzes' in quizList1) {
          expect(
            quizList1.quizzes.find(
              (quiz: quiz) => quiz.quizId === quizId1.quizId
            )
          ).toStrictEqual(undefined);
        }
      }
    });

    test('removed three quizes successfully', () => {
      const quizId = adminQuizCreateHelper(sessionId, 'Kelly', 'Kelly Kills Keys');
      const quizId1 = adminQuizCreateHelper(sessionId, 'Bill', 'Kill Bill Kill');
      const quizId2 = adminQuizCreateHelper(sessionId, 'Hello', 'Hello Bello Bello');

      if ('quizId' in quizId && 'quizId' in quizId1 && 'quizId' in quizId2) {
        expect(adminQuizRemoveHelper(sessionId, quizId.quizId)).toStrictEqual({});
        const quizList = adminQuizListHelper(sessionId);
        if ('quizzes' in quizList) {
          expect(
            quizList.quizzes.find((quiz: quiz) => quiz.quizId === quizId.quizId)
          ).toStrictEqual(undefined);
        }

        expect(adminQuizRemoveHelper(sessionId, quizId1.quizId)).toStrictEqual({});
        const quizList1 = adminQuizListHelper(sessionId);
        if ('quizzes' in quizList1) {
          expect(
            quizList1.quizzes.find(
              (quiz: quiz) => quiz.quizId === quizId1.quizId
            )
          ).toStrictEqual(undefined);
        }

        expect(adminQuizRemoveHelper(sessionId, quizId2.quizId)).toStrictEqual({});
        const quizList2 = adminQuizListHelper(sessionId);
        if ('quizzes' in quizList2) {
          expect(
            quizList2.quizzes.find(
              (quiz: quiz) => quiz.quizId === quizId2.quizId
            )
          ).toStrictEqual(undefined);
        }
      }
    });
  });

  describe('Failure Cases', () => {
    const quizId = adminQuizCreateHelper(sessionId, 'Kelly', 'Kelly Kills Keys');
    test('Invalid sessionID, Invalid quizID', () => {
      if ('quizId' in quizId) {
        expect(adminQuizRemoveHelper(sessionId + 5, quizId.quizId + 5)).toStrictEqual({
          error: expect.any(String),
        });
      }
    });

    test('Invalid sessionID, valid quizID', () => {
      const quizId = adminQuizCreateHelper(sessionId, 'Kelly', 'Kelly Kills Keys');
      if ('quizId' in quizId) {
        expect(adminQuizRemoveHelper(sessionId + 5, quizId.quizId)).toStrictEqual({
          error: expect.any(String),
        });
      }
    });

    test('Valid sessionID, Invalid quizID', () => {
      const quizId = adminQuizCreateHelper(sessionId, 'Kelly', 'Kelly Kills Keys');
      if ('quizId' in quizId) {
        expect(adminQuizRemoveHelper(sessionId, quizId.quizId + 5)).toStrictEqual({
          error: expect.any(String),
        });
      }
    });

    test('Valid quizID, not owned by sessionId', () => {
      const quizId = adminQuizCreateHelper(sessionId, 'Kelly', 'Kelly Kills Keys');
      const sessionId1 = adminAuthRegisterHelper(
        'user2@tookah.com',
        'Goodpasswordgood2',
        'Super',
        'Superman'
      );

      if ('sessionId' in sessionId1 && 'quizId' in quizId) {
        expect(
          adminQuizRemoveHelper(sessionId1.sessionId, quizId.quizId)
        ).toStrictEqual({
          error: expect.any(String),
        });
      }
    });
  });
});
