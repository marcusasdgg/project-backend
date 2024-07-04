// Importing the required functions and modules
import { clear } from "./other";
import { adminAuthRegister } from "./auth";
import { adminQuizCreate } from "./quiz";
import { describe, expect, test, beforeEach } from "@jest/globals";
import { error, sessionIdToken } from "./interface";

// Test suite for adminQuizCreate
describe("AdminQuizCreate", () => {
  beforeEach(() => {
    clear();
  });

  describe("Success Cases", () => {
    test("should create a quiz for a valid user", () => {
      // Register a new user
      const registerResponse: sessionIdToken | error =
        adminAuthRegister("validemail1@gmail.com", "123abc!@#", "John", "Doe");
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      // Create a quiz for the registered user
      if ("sessionId" in registerResponse) {
        const sessionId = registerResponse.sessionId;
        const createQuizResponse: error | { quizId: number } = adminQuizCreate(
          sessionId,
          "Valid Quiz",
          "This is a valid quiz description"
        );
        expect(createQuizResponse).toStrictEqual({
          quizId: expect.any(Number),
        });
      }
    });
  });

  describe("Failure Cases", () => {
    test("should return an error if session ID is invalid", () => {
      const invalidSessionId = 999;
      const createQuizResponse: error | { quizId: number } = adminQuizCreate(
        invalidSessionId,
        "Valid Quiz",
        "This is a valid quiz description"
      );
      expect(createQuizResponse).toStrictEqual({
        error: "invalid Token",
      });
    });

    test("should return an error if quiz name contains invalid characters", () => {
      // Register a new user
      const registerResponse: sessionIdToken | error =
        adminAuthRegister("validemail2@gmail.com", "123abc!@#", "Jane", "Doe");
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ("sessionId" in registerResponse) {
        const sessionId = registerResponse.sessionId;

        // Attempt to create a quiz with invalid name
        const createQuizResponse: error | { quizId: number } = adminQuizCreate(
          sessionId,
          "Invalid@Quiz!",
          "This is a valid quiz description"
        );
        expect(createQuizResponse).toStrictEqual({
          error: "Name contains invalid characters",
        });
      }
    });

    test("should return an error if quiz name is too short or too long", () => {
      // Register a new user
      const registerResponse: sessionIdToken | error =
        adminAuthRegister(
          "validemail3@gmail.com",
          "123abc!@#",
          "Mark",
          "Smith"
        );
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });
      if ("sessionId" in registerResponse) {
        const sessionId = registerResponse.sessionId;

        // Attempt to create a quiz with name too short
        const createQuizResponseShort: error | { quizId: number } =
          adminQuizCreate(sessionId, "No", "This is a valid quiz description");
        expect(createQuizResponseShort).toStrictEqual({
          error:
            "Name is either less than 3 characters long or more than 30 characters long",
        });

        // Attempt to create a quiz with name too long
        const createQuizResponseLong: error | { quizId: number } =
          adminQuizCreate(
            sessionId,
            "ThisQuizNameIsWayTooLongForTheLimit",
            "This is a valid quiz description"
          );
        expect(createQuizResponseLong).toStrictEqual({
          error:
            "Name is either less than 3 characters long or more than 30 characters long",
        });
      }
    });

    test("should return an error if description is too long", () => {
      // Register a new user
      const registerResponse: sessionIdToken | error =
        adminAuthRegister(
          "validemail4@gmail.com",
          "123abc!@#",
          "Alice",
          "Wonderland"
        );
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ("sessionId" in registerResponse) {
        const sessionId = registerResponse.sessionId;

        // Attempt to create a quiz with description too long
        const longDescription = "a".repeat(101);
        const createQuizResponse: error | { quizId: number } = adminQuizCreate(
          sessionId,
          "Valid Quiz",
          longDescription
        );
        expect(createQuizResponse).toStrictEqual({
          error: "Description is more than 100 characters in length",
        });
      }
    });

    test("should return an error if quiz name is already used by the user", () => {
      // Register a new user
      const registerResponse: sessionIdToken | error =
        adminAuthRegister(
          "validemail5@gmail.com",
          "123abc!@#",
          "Bob",
          "Builder"
        );
      expect(registerResponse).toStrictEqual({
        sessionId: expect.any(Number),
      });

      if ("sessionId" in registerResponse) {
        const sessionId = registerResponse.sessionId;

        // Create a quiz with a unique name
        const createQuizResponse1: error | { quizId: number } = adminQuizCreate(
          sessionId,
          "Unique Quiz",
          "This is a valid quiz description"
        );
        expect(createQuizResponse1).toStrictEqual({
          quizId: expect.any(Number),
        });

        // Attempt to create another quiz with the same name
        const createQuizResponse2: error | { quizId: number } = adminQuizCreate(
          sessionId,
          "Unique Quiz",
          "This is another valid quiz description"
        );
        expect(createQuizResponse2).toStrictEqual({
          error:
            "Name is already used by the current logged in user for another quiz",
        });
      }
    });
  });
});
