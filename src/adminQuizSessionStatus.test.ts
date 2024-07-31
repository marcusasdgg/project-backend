import { adminAuthRegisterHelper, adminQuizCreateHelper, adminQuizAddQuestionHelper, adminQuizSessionStartHelper, clearHelper, adminQuizSessionStatusHelper } from './httpHelperFunctions';
import { QuestionBody } from './interface';
import { describe, expect, test, beforeEach } from '@jest/globals';

describe('adminQuizSessionStatus', () => {
  let token: number;
  let quizId: number;
  let sessionId: number;
  let invalidToken: number;

  beforeEach(() => {
    clearHelper();

    // Register a new admin user and get the token
    const response = adminAuthRegisterHelper(
      'john@gmail.com',
      'John123456',
      'John',
      'Smith'
    );
    if ('sessionId' in response) {
      token = response.sessionId;
      invalidToken = token + 1; // Set an invalid token for testing

      // Create a new quiz and get its ID
      const quizResponse = adminQuizCreateHelper(token, 'Test Quiz', 'A Test Quiz');
      if ('quizId' in quizResponse) {
        quizId = quizResponse.quizId;

        // Add a question to the quiz
        const questionBody: QuestionBody = {
          question: 'This is a question?',
          duration: 2,
          points: 3,
          answers: [
            { answer: 'Nope', correct: false },
            { answer: 'Yes', correct: true },
          ],
        };

        adminQuizAddQuestionHelper(token, quizId, questionBody);

        // Start a session for the quiz and get the session ID
        const sessionResponse = adminQuizSessionStartHelper(quizId, token, 5);
        if ('sessionId' in sessionResponse) {
          sessionId = sessionResponse.sessionId;
        }
      }
    }
  });

  describe('success cases', () => {
    // Test fetching session status with valid credentials
    test.skip('fsuccess case with valid token and existing session', () => {
      const status = adminQuizSessionStatusHelper(quizId, sessionId, token);
      expect(status).toMatchObject({
        state: expect.any(String),
        atQuestion: expect.any(Number),
        players: expect.arrayContaining([expect.any(String)]),
        metadata: expect.objectContaining({
          quizId: quizId,
          name: expect.any(String),
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: expect.any(String),
          numQuestions: expect.any(Number),
          questions: expect.arrayContaining([expect.objectContaining({
            questionId: expect.any(Number),
            question: expect.any(String),
            duration: expect.any(Number),
            points: expect.any(Number),
            answers: expect.arrayContaining([expect.objectContaining({
              answerId: expect.any(Number),
              answer: expect.any(String),
              colour: expect.any(String),
              correct: expect.any(Boolean)
            })])
          })]),
          duration: expect.any(Number),
          thumbnailUrl: expect.any(String),
        })
      });
    });
  });

  describe('failure cases', () => {
    // Test with an invalid token
    test.skip('invalid token', () => {
      const status = adminQuizSessionStatusHelper(quizId, sessionId, invalidToken);
      expect(status).toStrictEqual({ error: 'Token is empty or invalid' });
    });

    test.skip("Valid token is provided, but user is not an owner of this quiz or quiz doesn't exist", () => {
      const response = adminAuthRegisterHelper('john@icloud.com', 'password123A1', 'john', 'smith');
      if ('sessionId' in response) {
        const token2 = response.sessionId;
        const status = adminQuizSessionStatusHelper(quizId, sessionId, token2);
        expect(status).toStrictEqual({ error: 'User is not authorized for this quiz or quiz doesnt exist' });
      }
    });

    test.skip('session id does not refer to a valid session', () => {
      const invalidSessionId = sessionId + 1; // Increment session ID to make it invalid
      const status = adminQuizSessionStatusHelper(quizId, invalidSessionId, token);
      expect(status).toStrictEqual({ error: 'Session Id does not refer to a valid session within this quiz' });
    });
  });
});