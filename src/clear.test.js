//This test file is meant to test the clear function in /other.js.

import { clear } from "./other.js"
import { adminAuthRegister } from "./auth.js"
import { expect, test } from '@jest/globals';
import { adminQuizCreate } from "./quiz.js";



beforeEach(() => {
  clear();
});

describe('authLogin', () => {
  describe('success Cases', () => {
    test("registering twice with the same email but separated by clear", () => {
      adminAuthRegister("a@gmail.com", "abcdefgh1", "asd", "abcde");
      const retcondition = clear();
      expect(retcondition).toStrictEqual({});
      const ifError = adminAuthRegister("a@gmail.com", "abcdefgh1", "asd", "abcde");
      expect(ifError).toStrictEqual({ authUserId: expect.any(Number) });
      clear();
    });
    test("create a quiz with the same name twice.", () => {
      const id = adminAuthRegister("a@gmail.com", "abcdefgh1", "asd", "abcde");
      adminQuizCreate(id.authUserId, "hello Quiz", "none");
      expect(clear()).toStrictEqual({});
      const idAfter = adminAuthRegister("a@gmail.com", "abcdefgh1", "asd", "abcde");
      const returncondition = adminQuizCreate(idAfter.authUserId, "hello Quiz", "none");
      expect(returncondition).toStrictEqual({ quizId: expect.any(Number) });
      clear();
    });
  });
});


//this is more or less the only tests we could do due to how simple the clear function is.

