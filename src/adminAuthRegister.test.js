import {clear} from "./other.js"
import {adminAuthLogin, adminAuthRegister, adminUserDetails} from "./auth.js"

describe("AdminAuthRegister", () => {
  describe("success Cases", () => {
    test("registering twice with the same email but separated by clear", () => {
      adminAuthRegister("a@gmail.com","abcdefgh1","asd","abcde");
      const retcondition = clear();
      expect(retcondition).toStrictEqual({});
      const ifError = adminAuthRegister("a@gmail.com","abcdefgh1","asd","abcde");
      console.log(ifError)
      expect(ifError).toStrictEqual({authUserId: expect.any(Number)});
    });
    
    test("normal test case with normal inputs.", () => {
      const id = adminAuthRegister("a@gmail.com","abcdefgh1","asd","abcde");
      expect(id).not.toStrictEqual({error: expect.any(String)})
      expect(adminUserDetails(id)).not.toStrictEqual({error: expect.any(String)})
    });
    
  });
  describe("failure Cases", () => {
    test("failure case with everything good but invalid email.", () => {
      const id = adminAuthRegister("a@.com","abcdefgh1","asd","abcde");
      expect(id).not.toStrictEqual({error: expect.any(String)});
      expect(adminUserDetails(id)).not.toStrictEqual({error: expect.any(String)});
    });

    test("failure case with everything good but email used by different user.", () => {
      const id = adminAuthRegister("a@gmail.com","abcdefgh1","asd","abcde");
      expect(id).not.toStrictEqual({error: expect.any(String)});
      expect(adminUserDetails(id)).not.toStrictEqual({error: expect.any(String)});
      const idsecond = adminAuthRegister("a@gmail.com","abcdefgh1","asd","abcde");
      expect(idsecond).not.toStrictEqual({error: expect.any(String)});
      expect(adminUserDetails(id)).not.toStrictEqual({error: expect.any(String)});
    });
  });
});