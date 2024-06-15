import {clear} from "./other.js"
import {adminAuthRegister} from "./auth.js"

describe("AdminAuthRegister", () => {
  describe("success Cases", () => {
    test("registering twice with the same email but separated by clear", () => {
      adminAuthRegister("a@gmail.com","abcdefgh","asd","abcde");
      const retcondition = clear();
      expect(retcondition).toStrictEqual({});
      const ifError = adminAuthRegister("a@gmail.com","abcdefgh","asd","abcde");
      console.log(ifError)
      expect(ifError).toStrictEqual({authUserId: expect.any(Number)});
    });
    
  });
  describe("failure Cases", () => {
    test
  });
});