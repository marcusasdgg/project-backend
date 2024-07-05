//This test file is meant to test the clear function in /other.js.

import { clear } from "./other";
import { adminAuthRegister } from "./auth";
import { expect, test, describe, beforeEach } from "@jest/globals";
import { adminQuizCreate } from "./quiz";
import {} from "./interface";

beforeEach(() => {
  clear();
});

describe("authLogin", () => {
  describe("success Cases", () => {
    test("registering twice with the same email but separated by clear", () => {
      adminAuthRegister("a@gmail.com", "abcdefgh1", "asd", "abcde");
      const retcondition: {} = clear();
      expect(retcondition).toStrictEqual({});
      const ifError = adminAuthRegister(
        "a@gmail.com",
        "abcdefgh1",
        "asd",
        "abcde"
      );
      expect(ifError).toStrictEqual({ sessionId: expect.any(Number) });
      clear();
    });
    test("create a quiz with the same name twice.", () => {
      const registerResponse = adminAuthRegister(
        "a@gmail.com",
        "abcdefgh1",
        "asd",
        "abcde"
      );

      if ("sessionId" in registerResponse) {
        adminQuizCreate(registerResponse.sessionId, "hello Quiz", "none");
        expect(clear()).toStrictEqual({});

        const registerResponseAfter = adminAuthRegister(
          "a@gmail.com",
          "abcdefgh1",
          "asd",
          "abcde"
        );

        if ("sessionId" in registerResponseAfter) {
          const returncondition: {} = adminQuizCreate(
            registerResponseAfter.sessionId,
            "hello Quiz",
            "none"
          );
          expect(returncondition).toStrictEqual({ quizId: expect.any(Number) });
          clear();
        }
      }
    });
  });
});

//this is more or less the only tests we could do due to how simple the clear function is.
