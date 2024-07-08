import { describe, expect, test, beforeEach } from "@jest/globals";
import { clearHelper, adminAuthRegisterHelper, adminQuizListHelper, adminQuizCreateHelper, adminQuizRemoveHelper, adminAuthLogoutHelper } from "./httpHelperFunctions";
import { quiz } from "./interface";

describe("adminAuthLogout", () => {
  let sessionId: number;

  beforeEach(() => {
    clearHelper();
    
  });

  describe("Successsful Cases", () => {
    test("logging out after login", () => {
      // expect().toStrictEqual({});
    });

    test("logging out after register", () => {
      // expect().toStrictEqual({});
    });

    test("logging out after register and login on different devices ", () => {
      // expect().toStrictEqual({});
    });
  });

  describe("Failure Cases", () => {
    test("token is invalid (does not refer to valid logged in user session)", () => {
      // expect().toStrictEqual({});
    });
  });
});