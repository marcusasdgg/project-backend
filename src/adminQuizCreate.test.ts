import { describe, expect, test, beforeEach } from '@jest/globals';
import {
  clearHelper,
  adminAuthRegisterHelper,
  adminQuizCreateHelper,
  adminQuizCreateV2Helper,
} from './httpHelperFunctions';
import { error, sessionIdToken } from './interface';

describe('QuizCreate', () => {
  describe('V1', () => {
    let validSessionId: number;

    beforeEach(() => {
      clearHelper();

      const registerResponse = adminAuthRegisterHelper('user1@tookah.com', 'iL0veT00kah', 'Brian', 'Bones');
      if ('sessionId' in registerResponse) {
        validSessionId = registerResponse.sessionId;
      }
    });

    describe('Success Cases', () => {
      test('should create a quiz for a valid user', () => {
        const createQuizResponse: error | { quizId: number } = adminQuizCreateHelper(
          validSessionId,
          'Valid Quiz',
          'This is a valid quiz description'
        );
        expect(createQuizResponse).toStrictEqual({
          quizId: expect.any(Number),
        });
      });
    });

    describe('Failure Cases', () => {
      test('should return an error if session ID is invalid', () => {
        const invalidSessionId = 999;
        const createQuizResponse: error | { quizId: number } = adminQuizCreateHelper(
          invalidSessionId,
          'Valid Quiz',
          'This is a valid quiz description'
        );
        expect(createQuizResponse).toStrictEqual({
          error: 'invalid Token',
        });
      });

      test('should return an error if quiz name contains invalid characters', () => {
        const createQuizResponse: error | { quizId: number } = adminQuizCreateHelper(
          validSessionId,
          'Invalid@Quiz!',
          'This is a valid quiz description'
        );
        expect(createQuizResponse).toStrictEqual({
          error: 'Name contains invalid characters',
        });
      });

      test('should return an error if quiz name is too short or too long', () => {
        const createQuizResponseShort: error | { quizId: number } =
          adminQuizCreateHelper(validSessionId, 'No', 'This is a valid quiz description');
        expect(createQuizResponseShort).toStrictEqual({
          error: 'Name is either less than 3 characters long or more than 30 characters long',
        });

        const createQuizResponseLong: error | { quizId: number } =
          adminQuizCreateHelper(
            validSessionId,
            'ThisQuizNameIsWayTooLongForTheLimit',
            'This is a valid quiz description'
          );
        expect(createQuizResponseLong).toStrictEqual({
          error: 'Name is either less than 3 characters long or more than 30 characters long',
        });
      });

      test('should return an error if description is too long', () => {
        const longDescription = 'a'.repeat(101);
        const createQuizResponse: error | { quizId: number } = adminQuizCreateHelper(
          validSessionId,
          'Valid Quiz',
          longDescription
        );
        expect(createQuizResponse).toStrictEqual({
          error: 'Description is more than 100 characters in length',
        });
      });

      test('should return an error if quiz name is already used by the user', () => {
        const createQuizResponse1: error | { quizId: number } = adminQuizCreateHelper(
          validSessionId,
          'Unique Quiz',
          'This is a valid quiz description'
        );
        expect(createQuizResponse1).toStrictEqual({
          quizId: expect.any(Number),
        });

        const createQuizResponse2: error | { quizId: number } = adminQuizCreateHelper(
          validSessionId,
          'Unique Quiz',
          'This is another valid quiz description'
        );
        expect(createQuizResponse2).toStrictEqual({
          error: 'Name is already used by the current logged in user for another quiz',
        });
      });
    });
  });

  describe('V2', () => {
    let validSessionId: number;

    beforeEach(() => {
      clearHelper();

      const registerResponse = adminAuthRegisterHelper('user2@tookah.com', 'iLHateT00kah', 'Bob', 'Jones');
      if ('sessionId' in registerResponse) {
        validSessionId = registerResponse.sessionId;
      }
    });

    describe('Success Cases', () => {
      test('should create a quiz for a valid user', () => {
        const createQuizResponse: error | { quizId: number } = adminQuizCreateV2Helper(
          validSessionId,
          'Valid Quiz',
          'This is a valid quiz description'
        );
        expect(createQuizResponse).toStrictEqual({
          quizId: expect.any(Number),
        });
      });
    });

    describe('Failure Cases', () => {
      test('should return an error if session ID is invalid', () => {
        const invalidSessionId = 999;
        const createQuizResponse: error | { quizId: number } = adminQuizCreateV2Helper(
          invalidSessionId,
          'Valid Quiz',
          'This is a valid quiz description'
        );
        expect(createQuizResponse).toStrictEqual({
          error: 'invalid Token',
        });
      });

      test('should return an error if quiz name contains invalid characters', () => {
        const createQuizResponse: error | { quizId: number } = adminQuizCreateV2Helper(
          validSessionId,
          'Invalid@Quiz!',
          'This is a valid quiz description'
        );
        expect(createQuizResponse).toStrictEqual({
          error: 'Name contains invalid characters',
        });
      });

      test('should return an error if quiz name is too short or too long', () => {
        const createQuizResponseShort: error | { quizId: number } =
          adminQuizCreateV2Helper(validSessionId, 'No', 'This is a valid quiz description');
        expect(createQuizResponseShort).toStrictEqual({
          error: 'Name is either less than 3 characters long or more than 30 characters long',
        });

        const createQuizResponseLong: error | { quizId: number } =
          adminQuizCreateV2Helper(
            validSessionId,
            'ThisQuizNameIsWayTooLongForTheLimit',
            'This is a valid quiz description'
          );
        expect(createQuizResponseLong).toStrictEqual({
          error: 'Name is either less than 3 characters long or more than 30 characters long',
        });
      });

      test('should return an error if description is too long', () => {
        const longDescription = 'a'.repeat(101);
        const createQuizResponse: error | { quizId: number } = adminQuizCreateV2Helper(
          validSessionId,
          'Valid Quiz',
          longDescription
        );
        expect(createQuizResponse).toStrictEqual({
          error: 'Description is more than 100 characters in length',
        });
      });

      test('should return an error if quiz name is already used by the user', () => {
        const createQuizResponse1: error | { quizId: number } = adminQuizCreateV2Helper(
          validSessionId,
          'Unique Quiz',
          'This is a valid quiz description'
        );
        expect(createQuizResponse1).toStrictEqual({
          quizId: expect.any(Number),
        });

        const createQuizResponse2: error | { quizId: number } = adminQuizCreateV2Helper(
          validSessionId,
          'Unique Quiz',
          'This is another valid quiz description'
        );
        expect(createQuizResponse2).toStrictEqual({
          error: 'Name is already used by the current logged in user for another quiz',
        });
      });
    });
  });
});
