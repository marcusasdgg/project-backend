import { describe, expect, test, beforeEach } from '@jest/globals';
import { clearHelper, adminAuthRegisterHelper, adminQuizCreateHelper, adminQuizTrashEmptyHelper, adminQuizRemoveHelper } from './httpHelperFunctions';
import { register } from 'module';

describe('AdminQuizTrashEmpty', () => {
  beforeEach(() => {
    clearHelper(); // Clear the database before each test
  });

  describe('Success Cases', () => {
    test('should permanently delete specific quizzes currently sitting in the trash', () => {
      const registerResponse = adminAuthRegisterHelper('validemail1@gmail.com', '123abc!@#', 'John', 'Doe');

      if ('sessionId' in registerResponse)
      {
        const token = registerResponse.sessionId;
        const createQuizResponse1 = adminQuizCreateHelper(token, 'Quiz 1', 'This is the first quiz');
        const createQuizResponse2 = adminQuizCreateHelper(token, 'Quiz 2', 'This is the second quiz');

        if ('quizId' in createQuizResponse1 && 'quizId' in createQuizResponse2) {
          const quizIds = [createQuizResponse1.quizId, createQuizResponse2.quizId];
          quizIds.forEach(quizId => adminQuizRemoveHelper(token, quizId));
  
          const response = adminQuizTrashEmptyHelper(token, quizIds);
          expect(response).toStrictEqual({});
        }

      }
      
    });
  });

  describe('Failure Cases', () => {
    test('should return an error if token is invalid', () => {
      const invalidToken = 999;
      const quizIds = [1, 2, 3];
      const response = adminQuizTrashEmptyHelper(invalidToken, quizIds);
      expect(response).toHaveProperty('error', 'invalid Token');
    });

    test('should return an error if quizIds are not in the trash', () => {
      const registerResponse = adminAuthRegisterHelper('validemail2@gmail.com', '123abc!@#', 'Jane', 'Doe');
      if ('error' in registerResponse) {
        throw new Error('Registration failed: ' + registerResponse.error);
      }

      const token = registerResponse.sessionId;
      const invalidQuizIds = [999, 1000];
      const response = adminQuizTrashEmptyHelper(token, invalidQuizIds);
      expect(response).toStrictEqual({error: expect.any(String)});
    });

    test('should return an error if quizIds do not belong to the user', () => {
      const registerResponse1 = adminAuthRegisterHelper('validemail3@gmail.com', '123abc!@#', 'Alice', 'Wonderland');
      const registerResponse2 = adminAuthRegisterHelper('validemail4@gmail.com', '123abc!@#', 'Bob', 'Builder');

      if ('sessionId' in registerResponse1 && 'sessionId' in registerResponse2)
      {
        const token1 = registerResponse1.sessionId;
      const token2 = registerResponse2.sessionId;

      const createQuizResponse1 = adminQuizCreateHelper(token1, 'Quiz 3', 'This is the third quiz');
      if ('error' in createQuizResponse1) {
        throw new Error('Quiz creation failed: ' + createQuizResponse1.error);
      }

      const quizIds = [createQuizResponse1.quizId];
      quizIds.forEach(quizId => adminQuizRemoveHelper(token1, quizId));

      const response = adminQuizTrashEmptyHelper(token2, quizIds);
      expect(response).toStrictEqual({error: expect.any(String)});
      }
      
    });
  });
});
