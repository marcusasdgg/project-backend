import { describe, expect, test, beforeEach } from '@jest/globals';
import {
  adminAuthRegisterHelper,
  adminQuizAddQuestionHelper,
  adminQuizDuplicateQuestionHelper,
  adminQuizDuplicateQuestionHelperV2,
  adminQuizCreateHelper,
  clearHelper,
  adminQuizInfoHelper,
  adminQuizAddQuestionHelperV2,
} from './httpHelperFunctions';
import { QuestionBody, answerBody } from './interface';

describe('QuizDuplicateQuestion', () => {
  describe('V1', () => {
    let validSessionId1: number;
    let validSessionId2: number;
    let validQuizId: number;
    let validQuestionId: number;

    beforeEach(() => {
      clearHelper();

      const registerResponse1 = adminAuthRegisterHelper(
        'user1@tookah.com',
        'iL0veT00kah',
        'Brian',
        'Bones'
      );

      if ('sessionId' in registerResponse1) {
        validSessionId1 = registerResponse1.sessionId;
      }

      const registerResponse2 = adminAuthRegisterHelper(
        'user1@tookah.com',
        'iL0veT00kah',
        'Brian',
        'Bones'
      );

      if ('sessionId' in registerResponse2) {
        validSessionId2 = registerResponse2.sessionId;
      }

      const quizCreateResponse = adminQuizCreateHelper(
        validSessionId1,
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
        answers: answerBodies,
      };

      const questionAddResponse = adminQuizAddQuestionHelper(
        validSessionId1,
        validQuizId,
        questionBody
      );

      if ('questionId' in questionAddResponse) {
        validQuestionId = questionAddResponse.questionId;
      }
    });

    describe('Success Cases', () => {
      test('should pass given all values are valid.', () => {
        expect(
          adminQuizDuplicateQuestionHelper(
            validSessionId1,
            validQuizId,
            validQuestionId
          )
        ).toStrictEqual({ questionId: expect.any(Number) });
      });

      test('should pass showing an increment in the question size in a quiz.', () => {
        const quiz = adminQuizInfoHelper(validSessionId1, validQuizId);
        adminQuizDuplicateQuestionHelper(
          validSessionId1,
          validQuizId,
          validQuestionId
        );
        const quiz2 = adminQuizInfoHelper(validSessionId1, validQuizId);

        if ('questions' in quiz && 'questions' in quiz2) {
          expect(quiz2.questions.length).toBeGreaterThan(quiz.questions.length);
        }
      });

      test('should pass showing a new push to the question array.', () => {
        const quiz = adminQuizInfoHelper(validSessionId1, validQuizId);
        adminQuizDuplicateQuestionHelper(
          validSessionId1,
          validQuizId,
          validQuestionId
        );
        const quiz2 = adminQuizInfoHelper(validSessionId1, validQuizId);

        if ('questions' in quiz && 'questions' in quiz2) {
          expect(quiz2.questions).not.toStrictEqual(quiz.questions);
        }
      });
    });

    describe('Failure Cases', () => {
      test('should fail given sessionId is invalid, all other values are valid.', () => {
        expect(
          adminQuizDuplicateQuestionHelper(
            validSessionId1 + validSessionId2 + 1,
            validQuizId,
            validQuestionId
          )
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given quizId is invalid, all other values are valid.', () => {
        expect(
          adminQuizDuplicateQuestionHelper(
            validSessionId1,
            validQuizId + 1,
            validQuestionId
          )
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given quiz is not owned by current user, all other values are valid', () => {
        expect(
          adminQuizDuplicateQuestionHelper(
            validSessionId2,
            validQuizId,
            validQuestionId
          )
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given questionId is invalid, all other values are valid', () => {
        expect(
          adminQuizDuplicateQuestionHelper(
            validSessionId1,
            validQuizId,
            validQuestionId + 1
          )
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail showing an increment in the question size in a quiz.', () => {
        const quiz = adminQuizInfoHelper(validSessionId1, validQuizId);
        expect(
          adminQuizDuplicateQuestionHelper(
            validSessionId1 + validSessionId2 + 1,
            validQuizId,
            validQuestionId
          )
        ).toStrictEqual({ error: expect.any(String) });
        const quiz2 = adminQuizInfoHelper(validSessionId1, validQuizId);

        if ('questions' in quiz && 'questions' in quiz2) {
          expect(quiz2.questions.length).toStrictEqual(quiz.questions.length);
        }
      });

      test('should fail showing a new push to the question array, given an invalid sessionId, all other values are valid.', () => {
        const quiz = adminQuizInfoHelper(validSessionId1, validQuizId);
        expect(
          adminQuizDuplicateQuestionHelper(
            validSessionId1 + validSessionId2 + 1,
            validQuizId,
            validQuestionId
          )
        ).toStrictEqual({ error: expect.any(String) });
        const quiz2 = adminQuizInfoHelper(validSessionId1, validQuizId);

        if ('questions' in quiz && 'questions' in quiz2) {
          expect(quiz2.questions).toStrictEqual(quiz.questions);
        }
      });
    });
  });

  describe('V2', () => {
    let validSessionId1: number;
    let validSessionId2: number;
    let validQuizId: number;
    let validQuestionId: number;

    beforeEach(() => {
      clearHelper();

      const registerResponse1 = adminAuthRegisterHelper(
        'user1@tookah.com',
        'iL0veT00kah',
        'Brian',
        'Bones'
      );

      if ('sessionId' in registerResponse1) {
        validSessionId1 = registerResponse1.sessionId;
      }

      const registerResponse2 = adminAuthRegisterHelper(
        'user1@tookah.com',
        'iL0veT00kah',
        'Brian',
        'Bones'
      );

      if ('sessionId' in registerResponse2) {
        validSessionId2 = registerResponse2.sessionId;
      }

      const quizCreateResponse = adminQuizCreateHelper(
        validSessionId1,
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
        answers: answerBodies,
      };

      const questionAddResponse = adminQuizAddQuestionHelperV2(
        validSessionId1,
        validQuizId,
        questionBody
      );

      if ('questionId' in questionAddResponse) {
        validQuestionId = questionAddResponse.questionId;
      }
    });

    describe('Success Cases', () => {
      test('should pass given all values are valid.', () => {
        expect(
          adminQuizDuplicateQuestionHelperV2(
            validSessionId1,
            validQuizId,
            validQuestionId
          )
        ).toStrictEqual({ questionId: expect.any(Number) });
      });
    });

    describe('Failure Cases', () => {
      test('should fail given sessionId is invalid, all other values are valid.', () => {
        expect(
          adminQuizDuplicateQuestionHelperV2(
            validSessionId1 + validSessionId2 + 1,
            validQuizId,
            validQuestionId
          )
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given quizId is invalid, all other values are valid.', () => {
        expect(
          adminQuizDuplicateQuestionHelperV2(
            validSessionId1,
            validQuizId + 1,
            validQuestionId
          )
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given questionId is invalid, all other values are valid', () => {
        expect(
          adminQuizDuplicateQuestionHelperV2(
            validSessionId1,
            validQuizId,
            validQuestionId + 1
          )
        ).toStrictEqual({ error: expect.any(String) });
      });
    });
  });
});
