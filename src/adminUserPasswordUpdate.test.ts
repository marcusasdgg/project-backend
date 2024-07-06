import { clear } from "./other";
import {
  adminUserPasswordUpdate,
  adminAuthRegister,
  adminAuthLogin,
} from "./auth";



import { expect, test, describe, beforeEach } from "@jest/globals";
import { error } from "./interface";
import { adminAuthRegisterHelper, adminUserPasswordUpdateHelper, clearHelper } from "./httpHelperFunctions";

describe("adminUserPasswordUpdate", () => {
  let userId: number;
  const email: string = "john@gmail.com";
  const nameFirst: string = "John";
  const nameLast: string = "Smith";
  const originalPassword: string = "Brooklyn99";
  const invalidId: number = -1;

  beforeEach(() => {
    clearHelper();
    const userObject = adminAuthRegisterHelper(
      email,
      originalPassword,
      nameFirst,
      nameLast
    );
    if (typeof userObject === "object" && "sessionId" in userObject) {
      userId = userObject.sessionId;
    }
  });

  describe("success cases", () => {
    test("changed password to another password.", () => {
      expect(
        adminUserPasswordUpdate(userId, originalPassword, "AnotherTvShow1")
      ).toStrictEqual({});
      expect(
        adminAuthLogin("john@gmail.com", "AnotherTvShow1")
      ).not.toStrictEqual({ error: expect.any(String) });
    });

    test("changed password to a similar password", () => {
      expect(
        adminUserPasswordUpdateHelper(userId, originalPassword, "Brooklyn98")
      ).toStrictEqual({});
      expect(adminAuthLogin("john@gmail.com", "Brooklyn98")).not.toStrictEqual({
        error: expect.any(String),
      });
    });
  });

  describe("failure cases", () => {
    test("authUserId is not valid.", () => {
      expect(
        adminUserPasswordUpdateHelper(invalidId, originalPassword, "Brooklyn98")
      ).not.toStrictEqual({});
    });

    test("Old Password is not the correct old password", () => {
      expect(
        adminUserPasswordUpdateHelper(invalidId, "Brooklyn981", "Brooklyn98")
      ).not.toStrictEqual({});
    });

    test("Old Password and New Password match exactly", () => {
      expect(
        adminUserPasswordUpdateHelper(invalidId, originalPassword, "Brooklyn99")
      ).not.toStrictEqual({});
    });

    test("New Password has already been used before by this user", () => {
      adminUserPasswordUpdateHelper(userId, originalPassword, "AnotherTvShow1");
      expect(
        adminUserPasswordUpdateHelper(userId, "AnotherTvShow1", originalPassword)
      ).not.toStrictEqual({});
    });

    test("New Password is less than 8 characters", () => {
      expect(
        adminUserPasswordUpdateHelper(invalidId, originalPassword, "boo1")
      ).not.toStrictEqual({});
    });

    test("New Password does not contain at least one number and at least one letter", () => {
      expect(
        adminUserPasswordUpdateHelper(invalidId, originalPassword, "Brooklynninenien")
      ).not.toStrictEqual({});
    });
  });
});
