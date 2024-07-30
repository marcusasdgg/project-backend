import { describe, expect, test, beforeEach } from '@jest/globals';
import {
  adminAuthRegisterHelper,
  adminQuizCreateHelper,
  clearHelper,
  adminQuizAddQuestionV2Helper,
  adminQuizSessionStartHelper, 
  adminQuizSessionUpdateHelper,
  adminPlayerGuestJoinHelper,
} from './httpHelperFunctions';
import { Action, QuestionBody, answerBody } from './interface';

describe('PlayerJoin', () => {
  let validToken: number;
  let validQuizId: number;
  let validQuestionId: number;
  let validSessionId: number;
  const validName = "John Stone";
  

  beforeEach(() => {
    clearHelper();

    const registerResponse1 = adminAuthRegisterHelper(
      'user1@tookah.com',
      'iL0veT00kah',
      'Brian',
      'Bones'
    );

    if ('sessionId' in registerResponse1) {
      validToken = registerResponse1.sessionId;
    }

    const quizCreateResponse = adminQuizCreateHelper(
      validToken,
      'Games',
      'Game Trivia!'
    );

    if ('quizId' in quizCreateResponse) {
      validQuizId = quizCreateResponse.quizId;
    }

    const answerBodies: answerBody[] = [];
    answerBodies.push({ answer: 'Apple', correct: true });
    answerBodies.push({ answer: 'Box', correct: false });
    answerBodies.push({ answer: 'Crane', correct: false });
    answerBodies.push({ answer: 'Door', correct: false });

    const questionBody: QuestionBody = {
      question: 'What is not a food?',
      duration: 5,
      points: 2,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      answers: answerBodies,
    };

    const questionAddResponse = adminQuizAddQuestionV2Helper(
      validToken,
      validQuizId,
      questionBody
    );

    if ('questionId' in questionAddResponse) {
      validQuestionId = questionAddResponse.questionId;
    }

    const sessionResponse = adminQuizSessionStartHelper(validQuizId, validToken, 5);

    if ('sessionId' in sessionResponse) {
      validSessionId = sessionResponse.sessionId;
    }
  });

  describe('Success Cases', () => {
    test('should pass given all values are valid.', () => {
      expect(adminPlayerGuestJoinHelper(validSessionId, validName)).toStrictEqual({ playerId: expect.any(Number) });
    });
  });

  describe('Failure Cases', () => {
    test('should fail, given session id does not refer to a valid session, all other values are valid.', () => {
      expect(() => adminPlayerGuestJoinHelper(validSessionId + 1, validName)).toThrow(Error);
    });

    test('should fail given, session is not in lobby, all other values are valid.', () => {
      expect(() => adminQuizSessionUpdateHelper(validQuizId, validToken, validSessionId, Action.NEXT_QUESTION)).not.toThrow(Error);
      expect(() => adminPlayerGuestJoinHelper(validSessionId, validName)).toThrow(Error);
    });

    test('should fail given, name of user entered is not unique, all other values are valid.', () => {
      expect(() => adminPlayerGuestJoinHelper(validSessionId, validName)).not.toThrow(Error);
      expect(() => adminPlayerGuestJoinHelper(validSessionId, validName)).toThrow(Error);
    });
  });
});
