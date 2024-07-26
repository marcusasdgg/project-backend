import { describe, expect, test, beforeEach } from '@jest/globals';
import { clearHelper, adminAuthRegisterHelper, adminQuizCreateHelper, adminQuizTrashEmptyHelper,adminQuizTrashEmptyV2Helper, adminQuizRemoveHelper } from './httpHelperFunctions';

describe('AdminQuizTrashEmpty', () => {
  let token: number;
  let invalidToken: number;

  let quizIds: number[];

  beforeEach(() => {
    clearHelper();
    const registerResponse = adminAuthRegisterHelper('validemail1@gmail.com', '123abc!@#', 'John', 'Doe');
    if ('sessionId' in registerResponse) {
      token = registerResponse.sessionId;
      invalidToken = token + 1;
    }

    const createQuizResponse1 = adminQuizCreateHelper(token, 'Quiz 1', 'This is the first quiz');
    const createQuizResponse2 = adminQuizCreateHelper(token, 'Quiz 2', 'This is the second quiz');

    if ('quizId' in createQuizResponse1 && 'quizId' in createQuizResponse2) {
      quizIds = [createQuizResponse1.quizId, createQuizResponse2.quizId];
      quizIds.forEach(quizId => adminQuizRemoveHelper(token, quizId));
    }
  });

  describe('Success Cases', () => {
    test('should permanently delete specific quizzes currently sitting in the trash', () => {
      const response = adminQuizTrashEmptyHelper(token, quizIds);
      expect(response).toStrictEqual({});
    });
  });

  describe('Failure Cases', () => {
    test('should return an error if token is invalid', () => {
      const response = adminQuizTrashEmptyHelper(invalidToken, quizIds);
      expect(response).toHaveProperty('error', 'invalid Token');
    });

    test('should return an error if quizIds are not in the trash', () => {
      const registerResponse = adminAuthRegisterHelper('validemail2@gmail.com', '123abc!@#', 'Jane', 'Doe');
      if ('sessionId' in registerResponse) {
        const newToken = registerResponse.sessionId;
        const response = adminQuizTrashEmptyHelper(newToken, quizIds);
        expect(response).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('should return an error if quizIds do not belong to the user', () => {
      const registerResponse1 = adminAuthRegisterHelper('validemail3@gmail.com', '123abc!@#', 'Alice', 'Wonderland');
      const registerResponse2 = adminAuthRegisterHelper('validemail4@gmail.com', '123abc!@#', 'Bob', 'Builder');

      if ('sessionId' in registerResponse1 && 'sessionId' in registerResponse2) {
        const token1 = registerResponse1.sessionId;
        const token2 = registerResponse2.sessionId;

        const createQuizResponse1 = adminQuizCreateHelper(token1, 'Quiz 3', 'This is the third quiz');
        if ('quizId' in createQuizResponse1) {
          const quizIds = [createQuizResponse1.quizId];
          quizIds.forEach(quizId => adminQuizRemoveHelper(token1, quizId));

          const response = adminQuizTrashEmptyHelper(token2, quizIds);
          expect(response).toStrictEqual({ error: expect.any(String) });
        }
      }
    });
  });
});

describe('V2', () => {
  let token: number;
  let invalidToken: number;

  let quizIds: number[];

  beforeEach(() => {
    clearHelper();
    const registerResponse = adminAuthRegisterHelper('validemail21@gmail.com', '123abc!@#', 'John', 'Doe');
    if ('sessionId' in registerResponse) {
      token = registerResponse.sessionId;
      invalidToken = token + 1;
    }

    const createQuizResponse1 = adminQuizCreateHelper(token, 'Quiz 1', 'This is the first quiz');
    const createQuizResponse2 = adminQuizCreateHelper(token, 'Quiz 2', 'This is the second quiz');

    if ('quizId' in createQuizResponse1 && 'quizId' in createQuizResponse2) {
      quizIds = [createQuizResponse1.quizId, createQuizResponse2.quizId];
      quizIds.forEach(quizId => adminQuizRemoveHelper(token, quizId));
    }
  });

  describe('Success Cases', () => {
    test('should permanently delete specific quizzes currently sitting in the trash', () => {
      const response = adminQuizTrashEmptyV2Helper(token, quizIds);
      expect(response).toStrictEqual({});
    });
  });

  describe('Failure Cases', () => {
    test('should return an error if token is invalid', () => {
      const response = adminQuizTrashEmptyV2Helper(invalidToken, quizIds);
      expect(response).toHaveProperty('error', 'invalid Token');
    });

    test('should return an error if quizIds are not in the trash', () => {
      const registerResponse = adminAuthRegisterHelper('validemail22@gmail.com', '123abc!@#', 'Jane', 'Doe');
      if ('sessionId' in registerResponse) {
        const newToken = registerResponse.sessionId;
        const response = adminQuizTrashEmptyV2Helper(newToken, quizIds);
        expect(response).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('should return an error if quizIds do not belong to the user', () => {
      const registerResponse1 = adminAuthRegisterHelper('validemail23@gmail.com', '123abc!@#', 'Alice', 'Wonderland');
      const registerResponse2 = adminAuthRegisterHelper('validemail24@gmail.com', '123abc!@#', 'Bob', 'Builder');

      if ('sessionId' in registerResponse1 && 'sessionId' in registerResponse2) {
        const token1 = registerResponse1.sessionId;
        const token2 = registerResponse2.sessionId;

        const createQuizResponse1 = adminQuizCreateHelper(token1, 'Quiz 3', 'This is the third quiz');
        if ('quizId' in createQuizResponse1) {
          const quizIds = [createQuizResponse1.quizId];
          quizIds.forEach(quizId => adminQuizRemoveHelper(token1, quizId));

          const response = adminQuizTrashEmptyV2Helper(token2, quizIds);
          expect(response).toStrictEqual({ error: expect.any(String) });
        }
      }
    });
  });
});
