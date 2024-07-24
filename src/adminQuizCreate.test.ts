
import { clear } from './other';
import { describe, expect, test, beforeEach } from '@jest/globals';
import { adminAuthRegisterHelper, adminQuizCreateHelper } from './httpHelperFunctions';
import { error, sessionIdToken } from './interface';


describe('AdminQuizCreate', () => {
  beforeEach(() => {
    clear();
  });

  describe('Success Cases', () => {
    test('should create a quiz for a valid user', () => {

      const registerResponse: sessionIdToken | error =
        adminAuthRegisterHelper('uniqueemail1@gmail.com', '123abc!@#', 'John', 'Doe');
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const token: number = registerResponse.sessionId as number;
        const createQuizResponse: error | { quizId: number } = adminQuizCreateHelper(
          token,
          'Valid Quiz',
          'This is a valid quiz description'
        );
        expect(createQuizResponse).toStrictEqual({
          quizId: expect.any(Number),
        });
      }
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
   
      const registerResponse: sessionIdToken | error =
        adminAuthRegisterHelper('uniqueemail2@gmail.com', '123abc!@#', 'Jane', 'Doe');
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const token: number = registerResponse.sessionId as number;
        const createQuizResponse: error | { quizId: number } = adminQuizCreateHelper(
          token,
          'Invalid@Quiz!',
          'This is a valid quiz description'
        );
        expect(createQuizResponse).toStrictEqual({
          error: 'Name contains invalid characters',
        });
      }
    });

    test('should return an error if quiz name is too short or too long', () => {
      const registerResponse: sessionIdToken | error =
        adminAuthRegisterHelper(
          'uniqueemail3@gmail.com',
          '123abc!@#',
          'Mark',
          'Smith'
        );
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });
      if ('sessionId' in registerResponse) {
        const token: number = registerResponse.sessionId as number;

        const createQuizResponseShort: error | { quizId: number } =
          adminQuizCreateHelper(token, 'No', 'This is a valid quiz description');
        expect(createQuizResponseShort).toStrictEqual({
          error:
            'Name is either less than 3 characters long or more than 30 characters long',
        });
        const createQuizResponseLong: error | { quizId: number } =
          adminQuizCreateHelper(
            token,
            'ThisQuizNameIsWayTooLongForTheLimit',
            'This is a valid quiz description'
          );
        expect(createQuizResponseLong).toStrictEqual({
          error:
            'Name is either less than 3 characters long or more than 30 characters long',
        });
      }
    });

    test('should return an error if description is too long', () => {
      const registerResponse: sessionIdToken | error =
        adminAuthRegisterHelper(
          'uniqueemail4@gmail.com',
          '123abc!@#',
          'Alice',
          'Wonderland'
        );
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const token: number = registerResponse.sessionId as number;
        const longDescription = 'a'.repeat(101);
        const createQuizResponse: error | { quizId: number } = adminQuizCreateHelper(
          token,
          'Valid Quiz',
          longDescription
        );
        expect(createQuizResponse).toStrictEqual({
          error: 'Description is more than 100 characters in length',
        });
      }
    });

    test('should return an error if quiz name is already used by the user', () => {

      const registerResponse: sessionIdToken | error =
        adminAuthRegisterHelper(
          'uniqueemail5@gmail.com',
          '123abc!@#',
          'Bob',
          'Builder'
        );
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const token: number = registerResponse.sessionId as number;


        const createQuizResponse1: error | { quizId: number } = adminQuizCreateHelper(
          token,
          'Unique Quiz',
          'This is a valid quiz description'
        );
        expect(createQuizResponse1).toStrictEqual({
          quizId: expect.any(Number),
        });

        
        const createQuizResponse2: error | { quizId: number } = adminQuizCreateHelper(
          token,
          'Unique Quiz',
          'This is another valid quiz description'
        );
        expect(createQuizResponse2).toStrictEqual({
          error:
            'Name is already used by the current logged in user for another quiz',
        });
      }
    });
  });
});
