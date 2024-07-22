import { describe, expect, test, beforeEach } from '@jest/globals';
import {
  adminAuthRegisterHelper,
  adminQuizAddQuestionHelper,
  adminQuizAddQuestionHelperV2,
  adminQuizCreateHelper,
  adminQuizInfoHelper,
  clearHelper,
} from './httpHelperFunctions';
import { QuestionBody, answerBody, error } from './interface';

describe('QuizAddQuestion', () => {
  describe('V1', () => {
    let validSessionId1: number;
    let validSessionId2: number;
    let validQuizId: number;
    let answerBodies: answerBody[];

    beforeEach(() => {
      clearHelper();
      answerBodies = [];

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
        'user2@tookah.com',
        'iLHateT00kah',
        'Bob',
        'Jones'
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

      answerBodies.push({ answer: 'Apple', correct: true });
      answerBodies.push({ answer: 'Box', correct: false });
      answerBodies.push({ answer: 'Crane', correct: false });
      answerBodies.push({ answer: 'Door', correct: false });
    });

    describe('Success Cases', () => {
      test('should pass given all values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ questionId: expect.any(Number) });
      });

      test('should pass given question string of 5 characters, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What ',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ questionId: expect.any(Number) });
      });

      test('should pass given question string of 50 characters, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is something you eat among the answers here??',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ questionId: expect.any(Number) });
      });

      test('should pass given question has only 2 answer, all other values are valid.', () => {
        answerBodies.pop();
        answerBodies.pop();
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ questionId: expect.any(Number) });
      });

      test('should pass given question has only 6 answer, all other values are valid.', () => {
        answerBodies.push({ answer: 'Earth', correct: false });
        answerBodies.push({ answer: 'Fist', correct: false });
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ questionId: expect.any(Number) });
      });

      test('should pass given question duration is 1, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 1,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ questionId: expect.any(Number) });
      });

      test('should pass given cummulative question duration is 180 seconds or 3 minutes, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 180,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ questionId: expect.any(Number) });
      });

      test('should pass given question points awarded are 1, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 1,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ questionId: expect.any(Number) });
      });

      test('should pass given question points awarded are 10, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 10,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ questionId: expect.any(Number) });
      });

      test('should pass given any answer string in the question has a length of 1 characters, all other values are valid.', () => {
        answerBodies.push({ answer: 'E', correct: false });
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ questionId: expect.any(Number) });
      });

      test('should pass given any answer string in the question has a length of 30 characters, all other values are valid.', () => {
        answerBodies.push({
          answer: 'Earth Is so huge today innit??',
          correct: false,
        });
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ questionId: expect.any(Number) });
      });

      test('should pass given any answer string in the question has a length of 30 characters, all other values are valid.', () => {
        answerBodies.push({
          answer: 'Earth Is so huge today innit??',
          correct: false,
        });
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ questionId: expect.any(Number) });
      });

      test('should pass showing an increment in the question size in a quiz, given all values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        const quiz = adminQuizInfoHelper(validSessionId1, validQuizId);
        adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody);

        const quiz2 = adminQuizInfoHelper(validSessionId1, validQuizId);

        if ('questions' in quiz && 'questions' in quiz2) {
          expect(quiz2.questions.length).toBeGreaterThan(quiz.questions.length);
        }
      });

      test('should pass showing a new push to the question array, given all values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        const questionId: { questionId: number } | error = adminQuizAddQuestionHelper(
          validSessionId1,
          validQuizId,
          questionBody
        );

        const quiz = adminQuizInfoHelper(validSessionId1, validQuizId);

        if ('questions' in quiz && !('error' in questionId)) {
          expect(quiz.questions).toStrictEqual([
            {
              questionId: questionId.questionId,
              question: questionBody.question,
              timeCreated: expect.any(Number),
              timeLastEdited: expect.any(Number),
              duration: questionBody.duration,
              points: questionBody.points,
              answers: expect.any(Array),
            },
          ]);
        }
      });
    });

    describe('Failure Cases', () => {
      test('should fail given sessionId is invalid, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(
            validSessionId1 + validSessionId2 + 1,
            validQuizId,
            questionBody
          )
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given quizId is invalid, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(
            validSessionId1,
            validQuizId + 1,
            questionBody
          )
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given quiz is not owned by current user, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId2, validQuizId, questionBody)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given question string of 4 characters, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given question string of 51 characters, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is something you eat among the answers here???',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given question has only 1 answer, all other values are valid.', () => {
        answerBodies.pop();
        answerBodies.pop();
        answerBodies.pop();
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given question has 7 answer, all other values are valid.', () => {
        answerBodies.push({ answer: 'Earth', correct: false });
        answerBodies.push({ answer: 'Fist', correct: false });
        answerBodies.push({ answer: 'Gun', correct: false });
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given question duration is -1, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: -1,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given cummulative question duration is 185 seconds or 3 minutes and 5 seconds, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 185,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given question points awarded are 0, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 0,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given question points awarded are 11, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 11,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given any answer string in the question has a length of 0 characters, all other values are valid.', () => {
        answerBodies.push({ answer: '', correct: false });
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given any answer string in the question has a length of 31 characters, all other values are valid.', () => {
        answerBodies.push({
          answer: 'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
          correct: false,
        });
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given any answer in the question is a duplicate of another answer in the same question, all other values are valid.', () => {
        answerBodies.push({ answer: 'Gun', correct: false });
        answerBodies.push({ answer: 'Gun', correct: false });
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given no correct answer is present', () => {
        answerBodies.pop();
        answerBodies.pop();
        answerBodies.pop();
        answerBodies.pop();
        answerBodies.push({ answer: 'Apple', correct: false });
        answerBodies.push({ answer: 'Box', correct: false });

        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given question has no answers at all, all other values are valid.', () => {
        answerBodies.pop();
        answerBodies.pop();
        answerBodies.pop();
        answerBodies.pop();
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelper(validSessionId1, validQuizId, questionBody)
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail showing an increment in the question size in a quiz, given an invalid sessionId, given all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        const quiz2 = adminQuizInfoHelper(validSessionId1, validQuizId);
        expect(adminQuizAddQuestionHelper(
          validSessionId1 + validSessionId2 + 1,
          validQuizId,
          questionBody
        )).toStrictEqual({ error: expect.any(String) });

        const quiz = adminQuizInfoHelper(validSessionId1, validQuizId);

        if ('questions' in quiz && 'questions' in quiz2) {
          expect(quiz2.questions.length).toStrictEqual(quiz.questions.length);
        }
      });
    });
  });

  describe('V2', () => {
    let validSessionId1: number;
    let validSessionId2: number;
    let validQuizId: number;
    let answerBodies: answerBody[];

    beforeEach(() => {
      clearHelper();
      answerBodies = [];

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
        'user2@tookah.com',
        'iLHateT00kah',
        'Bob',
        'Jones'
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

      answerBodies.push({ answer: 'Apple', correct: true });
      answerBodies.push({ answer: 'Box', correct: false });
      answerBodies.push({ answer: 'Crane', correct: false });
      answerBodies.push({ answer: 'Door', correct: false });
    });

    describe('Success Cases V2', () => {
      test('should pass given all values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelperV2(
            validSessionId1,
            validQuizId,
            questionBody
          )
        ).toStrictEqual({ questionId: expect.any(Number) });
      });
    });

    describe('Failure Cases V2', () => {
      test('should fail given sessionId is invalid, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelperV2(
            validSessionId1 + validSessionId2 + 1,
            validQuizId,
            questionBody
          )
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given quizId is invalid, all other values are valid.', () => {
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelperV2(
            validSessionId1,
            validQuizId + 1,
            questionBody
          )
        ).toStrictEqual({ error: expect.any(String) });
      });

      test('should fail given question has 7 answer, all other values are valid.', () => {
        answerBodies.push({ answer: 'Earth', correct: false });
        answerBodies.push({ answer: 'Fist', correct: false });
        answerBodies.push({ answer: 'Gun', correct: false });
        const questionBody: QuestionBody = {
          question: 'What is not a food?',
          duration: 5,
          points: 2,
          answers: answerBodies,
        };

        expect(
          adminQuizAddQuestionHelperV2(
            validSessionId1,
            validQuizId,
            questionBody
          )
        ).toStrictEqual({ error: expect.any(String) });
      });
    });
  });
});
