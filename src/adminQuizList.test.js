// Importing the required functions and modules
import {clear} from "./other.js";
import { describe, expect, test, beforeEach } from "@jest/globals";
import { adminAuthRegister, adminAuthLogin } from "./auth.js";
import { adminQuizCreate, adminQuizList } from "./quiz.js";

// Test suite for adminQuizList
describe('AdminQuizList', () => {
  beforeEach(() => {
    clear();
  });

  describe('Success Cases', () => {
    test('should return a list of quizzes for a valid user with one quiz', () => {
      // Register a new user
      const registerResponse = adminAuthRegister('validemail1@gmail.com', '123abc!@#', 'John', 'Doe');
      expect(registerResponse).toStrictEqual({ authUserId: expect.any(Number) });

      const authUserId = registerResponse.authUserId;

      // Create a new quiz for the registered user
      const createQuizResponse = adminQuizCreate(authUserId, 'Quiz 1', 'This is the first quiz');
      expect(createQuizResponse).toStrictEqual({ quizId: expect.any(Number) });

      // List quizzes for the registered user
      const listQuizzesResponse = adminQuizList(authUserId);
      expect(listQuizzesResponse).toStrictEqual({
        quizzes: [
          {
            quizId: expect.any(Number),
            name: 'Quiz 1',
          },
        ],
      });
    });

    test('should return a list of quizzes for a valid user with multiple quizzes', () => {
      // Register a new user
      const registerResponse = adminAuthRegister('validemail2@gmail.com', '123abc!@#', 'Jane', 'Doe');
      expect(registerResponse).toStrictEqual({ authUserId: expect.any(Number) });

      const authUserId = registerResponse.authUserId;

      // Create multiple quizzes for the registered user
      const createQuizResponse1 = adminQuizCreate(authUserId, 'Quiz 2', 'This is the second quiz');
      expect(createQuizResponse1).toStrictEqual({ quizId: expect.any(Number) });
      const createQuizResponse2 = adminQuizCreate(authUserId, 'Quiz 3', 'This is the third quiz');
      expect(createQuizResponse2).toStrictEqual({ quizId: expect.any(Number) });

      // List quizzes for the registered user
      const listQuizzesResponse = adminQuizList(authUserId);
      expect(listQuizzesResponse).toStrictEqual({
        quizzes: [
          {
            quizId: expect.any(Number),
            name: 'Quiz 2',
          },
          {
            quizId: expect.any(Number),
            name: 'Quiz 3',
          },
        ],
      });
    });
  });

  describe('Failure Cases', () => {
    test('should return an error for an invalid user', () => {
      const invalidUserId = 999;
      const listQuizzesResponse = adminQuizList(invalidUserId);
      expect(listQuizzesResponse).toStrictEqual({ error: 'AuthUserId is not a valid user' });
    });

    test('should return an empty list for a valid user with no quizzes', () => {
      // Register a new user
      const registerResponse = adminAuthRegister('validemail3@gmail.com', '123abc!@#', 'Mark', 'Smith');
      expect(registerResponse).toStrictEqual({ authUserId: expect.any(Number) });

      const authUserId = registerResponse.authUserId;

      // List quizzes for the registered user
      const listQuizzesResponse = adminQuizList(authUserId);
      expect(listQuizzesResponse).toStrictEqual({ quizzes: [] });
    });
  });
});
