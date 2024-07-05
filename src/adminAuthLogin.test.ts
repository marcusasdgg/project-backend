import { describe, expect, test, beforeEach } from "@jest/globals";
import { adminAuthLogin, adminAuthRegister } from "./auth";
import { clear } from "./other";
import { sessionIdToken} from "./interface";
import {adminAuthRegisterHelper, adminAuthLoginHelper} from "./httpHelperFunctions"

describe("testing adminAuthLogin function", () => {
  beforeEach(() => {
    clear();
  });

  describe("testing failure case", () => {
    test("test for invalid email", () => {
      adminAuthRegisterHelper("john@gmail.com", "ThisisavalidPW123", "John", "Smith");
      let email = "sarah@gmail.com";
      let password = "ThisisavalidPW123";
      expect(adminAuthLogin(email, password)).toStrictEqual({
        error: "Email address does not exist",
      });
    });

    test("test for valid email with invalid password", () => {
      adminAuthRegisterHelper("sarah@gmail.com", "passwordA2", "sarah", "smith");
      let email = "sarah@gmail.com";
      let password = "passwordBBB2";
      expect(adminAuthLogin(email, password)).toStrictEqual({
        error: "The password is incorrect",
      });
    });

    test("test for invalid email and invalid password", () => {
      adminAuthRegisterHelper("johhny@gmail.com", "passwordBB2", "johnny", "smith");
      let email = "invalidjohhny@gmail.com";
      let password = "notpasswordBB2";
      expect(adminAuthLogin(email, password)).toStrictEqual({
        error: "Email address does not exist",
      });
    });
  });

  describe("testing success case", () => {
    test("testing for an email and password that is valid", () => {
      adminAuthRegisterHelper("jane@gmail.com", "validPassword123", "sarah", "smith");
      let email = "jane@gmail.com";
      let password = "validPassword123";
      expect(adminAuthLogin(email, password)).toStrictEqual({
        sessionId: expect.any(Number),
      });
    });
  });
});
