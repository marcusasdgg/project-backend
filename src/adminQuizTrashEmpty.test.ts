import { describe, expect, test, beforeEach } from "@jest/globals";
import { clearHelper, adminAuthRegisterHelper, adminQuizCreateHelper, adminQuizTrashEmptyHelper, adminQuizRemoveHelper } from "./httpHelperFunctions";
import { error, sessionIdToken } from "./interface";

describe("AdminQuizTrashEmpty", () => {
  beforeEach(async () => {
     clearHelper();  // Make sure to clear the database or reset state here
  });

  describe("Success Cases", () => {
    test("should permanently delete specific quizzes currently sitting in the trash", async () => {
      const registerResponse =  adminAuthRegisterHelper("validemail1@gmail.com", "123abc!@#", "John", "Doe");
      
      // Check if the registerResponse is not an error before proceeding
      if (!('error' in registerResponse)) {
        const token = registerResponse.sessionId;
        const createQuizResponse1 =  adminQuizCreateHelper(token, "Quiz 1", "This is the first quiz");
        const createQuizResponse2 =  adminQuizCreateHelper(token, "Quiz 2", "This is the second quiz");
      
        if (!('error' in createQuizResponse1) && !('error' in createQuizResponse2)) {
          const quizIds = [createQuizResponse1.quizId, createQuizResponse2.quizId];
           Promise.all(quizIds.map(quizId => adminQuizRemoveHelper(token, quizId)));
          const response =  adminQuizTrashEmptyHelper(token, quizIds);
          expect(response).toStrictEqual({});
        }
      } else {
        expect(registerResponse).not.toHaveProperty('error');
      }
    });
  });

  describe("Failure Cases", () => {
    test("should return an error if token is invalid", async () => {
      const invalidToken = 999;
      const quizIds = [1, 2, 3];

      const response =  adminQuizTrashEmptyHelper(invalidToken, quizIds);
      expect(response).toHaveProperty('error', 'invalid Token');
    });

    test("should return an error if quizIds are not in the trash", async () => {
      const registerResponse =  adminAuthRegisterHelper("validemail2@gmail.com", "123abc!@#", "Jane", "Doe");
      if (!('error' in registerResponse)) {
        const token = registerResponse.sessionId;
        const invalidQuizIds = [999, 1000];

        const response =  adminQuizTrashEmptyHelper(token, invalidQuizIds);
        expect(response).toHaveProperty('error', 'One or more of the Quiz IDs is not currently in the trash');
      } else {
        expect(registerResponse).not.toHaveProperty('error');
      }
    });

    test("should return an error if quizIds do not belong to the user", async () => {
      const registerResponse1 =  adminAuthRegisterHelper("validemail3@gmail.com", "123abc!@#", "Alice", "Wonderland");
      const registerResponse2 =  adminAuthRegisterHelper("validemail4@gmail.com", "123abc!@#", "Bob", "Builder");

      if (!('error' in registerResponse1) && !('error' in registerResponse2)) {
        const token1 = registerResponse1.sessionId;
        const token2 = registerResponse2.sessionId;

        const createQuizResponse1 =  adminQuizCreateHelper(token1, "Quiz 3", "This is the third quiz");
        const createQuizResponse2 =  adminQuizCreateHelper(token1, "Quiz 4", "This is the fourth quiz");

        if (!('error' in createQuizResponse1) && !('error' in createQuizResponse2)) {
          const quizIds = [createQuizResponse1.quizId, createQuizResponse2.quizId];
           Promise.all(quizIds.map(quizId => adminQuizRemoveHelper(token1, quizId)));

          const response =  adminQuizTrashEmptyHelper(token2, quizIds);
          expect(response).toHaveProperty('error', "One or more of the Quiz IDs refers to a quiz that this current user does not own or doesn't exist");
        }
      } else {
        expect(registerResponse1).not.toHaveProperty('error');
        expect(registerResponse2).not.toHaveProperty('error');
      }
    });
  });
});
