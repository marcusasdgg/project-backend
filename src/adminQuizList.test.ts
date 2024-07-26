import { clearHelper, adminAuthRegisterHelper, adminQuizCreateHelper, adminQuizListHelper, adminQuizListV2Helper } from './httpHelperFunctions';
import { describe, expect, test, beforeEach } from '@jest/globals';
import { error, sessionIdToken } from './interface';

describe('AdminQuizList', () => {
  beforeEach(() => {
    clearHelper();
  });

  describe('Success Cases', () => {
    test('should return a list of quizzes for a valid user with one quiz', () => {
      const registerResponse: error | sessionIdToken =
        adminAuthRegisterHelper('uniqueemail1+list1@gmail.com', '123abc!@#', 'John', 'Doe');
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const token: number = registerResponse.sessionId;
        const createQuizResponse: error | { quizId: number } = adminQuizCreateHelper(
          token,
          'Quiz 1',
          'This is the first quiz'
        );
        expect(createQuizResponse).toStrictEqual({
          quizId: expect.any(Number),
        });
        const listQuizzesResponse = adminQuizListHelper(token);
        expect(listQuizzesResponse).toStrictEqual({
          quizzes: [
            {
              quizId: expect.any(Number),
              name: 'Quiz 1',
            },
          ],
        });
      }
    });

    test('should return a list of quizzes for a valid user with multiple quizzes', () => {
      const registerResponse: error | sessionIdToken = adminAuthRegisterHelper(
        'uniqueemail2+list2@gmail.com',
        '123abc!@#',
        'Jane',
        'Doe'
      );
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const token: number = registerResponse.sessionId;
        const createQuizResponse1 = adminQuizCreateHelper(
          token,
          'Quiz 2',
          'This is the second quiz'
        );
        expect(createQuizResponse1).toStrictEqual({
          quizId: expect.any(Number),
        });
        const createQuizResponse2 = adminQuizCreateHelper(
          token,
          'Quiz 3',
          'This is the third quiz'
        );
        expect(createQuizResponse2).toStrictEqual({
          quizId: expect.any(Number),
        });
        const listQuizzesResponse = adminQuizListHelper(token);
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
      }
    });
  });

  describe('Failure Cases', () => {
    test('should return an error for an invalid session ID', () => {
      const invalidToken: number = 999;
      const listQuizzesResponse = adminQuizListHelper(invalidToken);
      expect(listQuizzesResponse).toStrictEqual({
        error: 'invalid Token',
      });
    });

    test('should return an empty list for a valid user with no quizzes', () => {
      const registerResponse: error | sessionIdToken =
        adminAuthRegisterHelper(
          'uniqueemail3+list3@gmail.com',
          '123abc!@#',
          'Mark',
          'Smith'
        );
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const token: number = registerResponse.sessionId;
        const listQuizzesResponse = adminQuizListHelper(token);
        expect(listQuizzesResponse).toStrictEqual({ quizzes: [] });
      }
    });
  });
});

describe('V2', () => {
  beforeEach(() => {
    clearHelper();
  });

  describe('Success Cases', () => {
    test('should return a list of quizzes for a valid user with one quiz', () => {
      const registerResponse: error | sessionIdToken =
        adminAuthRegisterHelper('uniqueemail134+list1@gmail.com', '123abc!@#', 'John', 'Doe');
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const token: number = registerResponse.sessionId;
        const createQuizResponse: error | { quizId: number } = adminQuizCreateHelper(
          token,
          'Quiz 1',
          'This is the first quiz'
        );
        expect(createQuizResponse).toStrictEqual({
          quizId: expect.any(Number),
        });
        const listQuizzesResponse = adminQuizListV2Helper(token);
        expect(listQuizzesResponse).toStrictEqual({
          quizzes: [
            {
              quizId: expect.any(Number),
              name: 'Quiz 1',
            },
          ],
        });
      }
    });

    test('should return a list of quizzes for a valid user with multiple quizzes', () => {
      const registerResponse: error | sessionIdToken = adminAuthRegisterHelper(
        'uniqueemail123+list2@gmail.com',
        '123abc!@#',
        'Jane',
        'Doe'
      );
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const token: number = registerResponse.sessionId;
        const createQuizResponse1 = adminQuizCreateHelper(
          token,
          'Quiz 2',
          'This is the second quiz'
        );
        expect(createQuizResponse1).toStrictEqual({
          quizId: expect.any(Number),
        });
        const createQuizResponse2 = adminQuizCreateHelper(
          token,
          'Quiz 3',
          'This is the third quiz'
        );
        expect(createQuizResponse2).toStrictEqual({
          quizId: expect.any(Number),
        });
        const listQuizzesResponse = adminQuizListV2Helper(token);
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
      }
    });
  });

  describe('Failure Cases', () => {
    test('should return an error for an invalid session ID', () => {
      const invalidToken: number = 999;
      const listQuizzesResponse = adminQuizListV2Helper(invalidToken);
      expect(listQuizzesResponse).toStrictEqual({
        error: 'invalid Token',
      });
    });

    test('should return an empty list for a valid user with no quizzes', () => {
      const registerResponse: error | sessionIdToken =
        adminAuthRegisterHelper(
          'uniqueemail345+list3@gmail.com',
          '123abc!@#',
          'Mark',
          'Smith'
        );
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ('sessionId' in registerResponse) {
        const token: number = registerResponse.sessionId;
        const listQuizzesResponse = adminQuizListV2Helper(token);
        expect(listQuizzesResponse).toStrictEqual({ quizzes: [] });
      }
    });
  });
});
