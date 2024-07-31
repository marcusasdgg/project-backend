import { describe, expect, test, beforeEach } from '@jest/globals';
import {
  adminAuthRegisterHelper,
  adminPlayerGuestJoinHelper,
  adminQuizCreateHelper,
  adminQuizAddQuestionV2Helper,
  adminQuizSessionStartHelper,
  adminPlayerStatusHelper,
  clearHelper,
} from './httpHelperFunctions';
import { QuestionBody, answerBody } from './interface';

describe('PlayerSessionStatus test suite', () => {
  let validToken: number;
  let validQuizId: number;
  let validSessionId: number;
  let validPlayerId: number;
  const validName = 'John Stone';

  beforeEach(() => {
    clearHelper();

    // Register a user
    const registerResponse = adminAuthRegisterHelper(
      'user1@tookah.com',
      'iL0veT00kah',
      'Brian',
      'Bones'
    );

    if ('sessionId' in registerResponse) {
      validToken = registerResponse.sessionId;
    }

    // Create a quiz
    const quizCreateResponse = adminQuizCreateHelper(
      validToken,
      'Games',
      'Game Trivia!'
    );

    if ('quizId' in quizCreateResponse) {
      validQuizId = quizCreateResponse.quizId;
    }

    // Add a question to the quiz
    const answerBodies: answerBody[] = [
      { answer: 'Apple', correct: true },
      { answer: 'Box', correct: false },
      { answer: 'Crane', correct: false },
      { answer: 'Door', correct: false }
    ];

    const questionBody: QuestionBody = {
      question: 'What is not a food?',
      duration: 5,
      points: 2,
      thumbnailUrl: 'http://toohui.com/random/image/.jpg',
      answers: answerBodies,
    };

    adminQuizAddQuestionV2Helper(validToken, validQuizId, questionBody);

    // Start a quiz session
    const sessionResponse = adminQuizSessionStartHelper(validQuizId, validToken, 5);

    if ('sessionId' in sessionResponse) {
      validSessionId = sessionResponse.sessionId;
    }

    // Join the session as a player
    const playerJoinResponse = adminPlayerGuestJoinHelper(validSessionId, validName);

    if ('playerId' in playerJoinResponse) {
      validPlayerId = playerJoinResponse.playerId;
    }
  });

  describe('Success Cases', () => {
    test.skip('should return player session status with valid player ID.', () => {
      const status = adminPlayerStatusHelper(validPlayerId);
      expect(status).toEqual({
        state: 'LOBBY',
        numQuestions: 1,
        atQuestion: 1
      });
    });
  });

  describe('Failure Cases', () => {
    test('should return an error if player ID does not exist.', () => {
      const invalidPlayerId = validPlayerId + 1;
      const status = adminPlayerStatusHelper(invalidPlayerId);
      expect(status).toEqual({
        error: 'Player ID does not exist'
      });
    });
  });
});
