//This test file is meant to test the clear function in /other.js.

import {clear} from "./other.js"
import {adminAuthRegister} from "./auth.js"
import {expect, test} from '@jest/globals';
import { adminQuizCreate } from "./quiz.js";

describe('authLogin', () => {
  describe('success Cases', () => {
    test("registering twice with the same email but separated by clear", () => {
      adminAuthRegister("a@gmail.com","a","a","a");
      const retcondition = clear();
      expect(retcondition).toStrictEqual({});
      const ifError = adminAuthRegister("a@gmail.com","abcdefgh","asd","a");
      console.log(ifError)
      expect(ifError).toStrictEqual({authUserId: expect.any(Number)});
    });
    test("create a quiz with the same name twice.", () => {
      const id = adminAuthRegister("a@gmail.com","a","a","a");
      adminQuizCreate(id, "hello Quiz","none");
      expect(clear()).toStrictEqual({});
      const returncondition = adminQuizCreate(id, "hello Quiz","none");
      expect(returncondition).toStrictEqual({quizId: expect.any(Number)});
    });
  });
});


//this is more or less the only tests we could do due to how simple the clear function is.

