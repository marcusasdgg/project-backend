import { describe, expect, test, beforeEach } from '@jest/globals';
import { clearHelper, adminAuthRegisterHelper, adminQuizCreateHelper, adminQuizQuestionMoveHelper, adminQuizAddQuestionHelper } from './httpHelperFunctions';
import { QuestionBody, error, sessionIdToken } from './interface';

describe('AdminQuizQuestionMove', () => {
  beforeEach(() => {
    clearHelper();
  });

  describe('Success Cases', () => {
    test('should move a question within a quiz for a valid user', () => {
      const registerResponse: error | sessionIdToken =
        adminAuthRegisterHelper('validemail1@gmail.com', '123abc!@#', 'John', 'Doe');
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const token = registerResponse.sessionId;

        const createQuizResponse = adminQuizCreateHelper(token, 'Quiz 1', 'This is the first quiz');
        expect(createQuizResponse).toStrictEqual({ quizId: expect.any(Number) });

        if ('quizId' in createQuizResponse) {
          const quizId = createQuizResponse.quizId;

          const questionBody: QuestionBody = {
            question: 'This is a question?',
            duration: 10,
            points: 3,
            answers: [
              { answer: 'Nope', correct: false },
              { answer: 'Yes', correct: true },
            ],
          };

          const addQuestionResponse = adminQuizAddQuestionHelper(token, quizId, questionBody);
          expect(addQuestionResponse).toStrictEqual({ questionId: expect.any(Number) });

          if ('questionId' in addQuestionResponse) {
            const questionId = addQuestionResponse.questionId;
            const newPosition = 0; 

            const moveQuestionResponse = adminQuizQuestionMoveHelper(token, quizId, questionId, newPosition);
            expect(moveQuestionResponse).toStrictEqual({});
          }
        }
      }
    });
  });

  describe('Failure Cases', () => {
    test('should return an error if token is invalid', () => {
      const registerResponse: error | sessionIdToken =
        adminAuthRegisterHelper('validemail2@gmail.com', '123abc!@#', 'Jane', 'Doe');
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const validToken = registerResponse.sessionId;
        const invalidToken = validToken + 1; 
        const quizId = 1;
        const questionId = 1;
        const newPosition = 1;

        const moveQuestionResponse = adminQuizQuestionMoveHelper(invalidToken, quizId, questionId, newPosition);
        expect(moveQuestionResponse).toStrictEqual({
          error: 'invalid Token',
        });
      }
    });

    test('should return an error if quizId or questionId is invalid', () => {
      const registerResponse: error | sessionIdToken =
        adminAuthRegisterHelper('validemail3@gmail.com', '123abc!@#', 'Mark', 'Smith');
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const validToken = registerResponse.sessionId;

        const createQuizResponse = adminQuizCreateHelper(validToken, 'Quiz 2', 'This is the second quiz');
        expect(createQuizResponse).toStrictEqual({ quizId: expect.any(Number) });

        if ('quizId' in createQuizResponse) {
          const quizId = createQuizResponse.quizId;

          const questionBody: QuestionBody = {
            question: 'This is another question?',
            duration: 10,
            points: 3,
            answers: [
              { answer: 'Nope', correct: false },
              { answer: 'Yes', correct: true },
            ],
          };

          const addQuestionResponse = adminQuizAddQuestionHelper(validToken, quizId, questionBody);
          expect(addQuestionResponse).toStrictEqual({ questionId: expect.any(Number) });

          if ('questionId' in addQuestionResponse) {
            const questionId = addQuestionResponse.questionId;
            const invalidQuizId = quizId + 1; 
            const invalidQuestionId = questionId + 1; 
            const newPosition = 1;

            const moveQuestionResponse = adminQuizQuestionMoveHelper(validToken, invalidQuizId, invalidQuestionId, newPosition);
            expect(moveQuestionResponse).toStrictEqual({ error: 'Quiz ID does not refer to a valid quiz' });
          }
        }
      }
    });

    test('should return an error if newPosition is out of range', () => {
      const registerResponse: error | sessionIdToken =
        adminAuthRegisterHelper('validemail4@gmail.com', '123abc!@#', 'Emily', 'Johnson');
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const validToken = registerResponse.sessionId;

        const createQuizResponse = adminQuizCreateHelper(validToken, 'Quiz 3', 'This is the third quiz');
        expect(createQuizResponse).toStrictEqual({ quizId: expect.any(Number) });

        if ('quizId' in createQuizResponse) {
          const quizId = createQuizResponse.quizId;

          const questionBody: QuestionBody = {
            question: 'This is yet another question?',
            duration: 10,
            points: 3,
            answers: [
              { answer: 'Nope', correct: false },
              { answer: 'Yes', correct: true },
            ],
          };

          const addQuestionResponse = adminQuizAddQuestionHelper(validToken, quizId, questionBody);
          expect(addQuestionResponse).toStrictEqual({ questionId: expect.any(Number) });

          if ('questionId' in addQuestionResponse) {
            const questionId = addQuestionResponse.questionId;
            const invalidNewPosition = -1;

            const moveQuestionResponse = adminQuizQuestionMoveHelper(validToken, quizId, questionId, invalidNewPosition);
            expect(moveQuestionResponse).toStrictEqual({
              error: 'New position is out of range',
            });
          }
        }
      }
    });
  });
});
