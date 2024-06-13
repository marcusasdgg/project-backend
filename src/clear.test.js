//This test file is meant to test the clear function in /other.js.

import clear from "./other.js"
import adminAuthRegister from "./auth.js"
import {expect, test} from '@jest/globals';

describe('authLogin', () => {
  describe('success Cases', () => {
    test("registering twice with the same email but separated by clear", () => {
      adminAuthRegister("a@gmail.com","a","a","a");
      const retcondition = clear();
      expect(retcondition).toStrictEqual({});
      const ifError = adminAuthRegister("a@gmail.com","a","a","a");
      expect(ifError).toBe(Number);
    });
  });
});


//this is more or less the only tests we could do due to how simple the clear function is.

