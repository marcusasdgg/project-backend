import {clear} from "./other.js"
import {adminAuthRegister} from "./auth.js"

describe("AdminAuthRegister", () => {
  describe("success Cases", () => {
    test("registering twice with the same email but separated by clear", () => {
      adminAuthRegister("a@gmail.com","a","a","a");
      const retcondition = clear();
      expect(retcondition).toStrictEqual({});
      const ifError = adminAuthRegister("a@gmail.com","a","a","a");
      console.log(ifError)
      expect(ifError).toStrictEqual({authUserId: expect.any(Number)});
    });
\
  });
  describe("failure Cases", () => {
    test
  });
});