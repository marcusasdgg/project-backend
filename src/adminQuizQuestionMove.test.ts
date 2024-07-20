import { describe, expect, test, beforeEach } from '@jest/globals';
import { clearHelper, adminAuthRegisterHelper, adminQuizCreateHelper, adminQuizQuestionMoveHelper } from './httpHelperFunctions';
import { QuestionBody, error, sessionIdToken } from './interface';
import { adminQuizAddQuestion } from './quiz';

describe('AdminQuizQuestionMove', () => {
  beforeEach(() => {
    clearHelper();
  });

  describe('Success Cases', () => {
    test('should move a question within a quiz for a valid user', () => {
      // Register a new user
      const registerResponse: error | sessionIdToken =
        adminAuthRegisterHelper('validemail1@gmail.com', '123abc!@#', 'John', 'Doe');
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const token = registerResponse.sessionId;

        // Create a new quiz for the registered user
        const createQuizResponse = adminQuizCreateHelper(token, 'Quiz 1', 'This is the first quiz');
        if ('quizId' in createQuizResponse) {
          expect(createQuizResponse).toStrictEqual({ quizId: expect.any(Number) });

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

          const questionId = adminQuizAddQuestion(token, quizId, questionBody);
          if ('questionId' in questionId) {
            const newPosition = 1;

            const moveQuestionResponse = adminQuizQuestionMoveHelper(token, quizId, questionId.questionId, newPosition); // Converting token to string if needed
            expect(moveQuestionResponse).toStrictEqual({});
          }
        }
      }
    });
  });

  describe('Failure Cases', () => {
    test('should return an error if token is invalid', () => {
      const invalidToken = 999; // Using a string directly for invalid token
      const quizId = 1;
      const questionId = 1;
      const newPosition = 1;

      const moveQuestionResponse = adminQuizQuestionMoveHelper(invalidToken, quizId, questionId, newPosition);
      expect(moveQuestionResponse).toStrictEqual({
        error: 'invalid Token',
      });
    });

    test('should return an error if quizId or questionId is invalid', () => {
      const registerResponse: error | sessionIdToken =
        adminAuthRegisterHelper('validemail2@gmail.com', '123abc!@#', 'Jane', 'Doe');
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const validToken = registerResponse.sessionId;
        const invalidQuizId = 999;
        const invalidQuestionId = 999;
        const newPosition = 1;

        const moveQuestionResponse = adminQuizQuestionMoveHelper(validToken, invalidQuizId, invalidQuestionId, newPosition);
        expect(moveQuestionResponse).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('should return an error if newPosition is out of range', () => {
      const registerResponse: error | sessionIdToken =
        adminAuthRegisterHelper('validemail3@gmail.com', '123abc!@#', 'Mark', 'Smith');
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const validToken = registerResponse.sessionId;
        const quiz = adminQuizCreateHelper(validToken, 'wow', 'aasdasd');
        if ('quizId' in quiz) {
          const questionBody: QuestionBody = {
            question: 'This is a question?',
            duration: 10,
            points: 3,
            answers: [
              { answer: 'Nope', correct: false },
              { answer: 'Yes', correct: true },
            ],
          };

          const question = adminQuizAddQuestion(validToken, quiz.quizId, questionBody);

          if ('questionId' in question) {
            const invalidNewPosition = -1;

            const moveQuestionResponse = adminQuizQuestionMoveHelper(validToken, quiz.quizId, question.questionId, invalidNewPosition); // Converting token to string if needed
            expect(moveQuestionResponse).toStrictEqual({
              error: 'newPosition is out of range',
            });
          }
        }
      }
    });
  });
});
