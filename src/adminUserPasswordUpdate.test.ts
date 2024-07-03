import { clear } from "./other";
import {
  adminUserPasswordUpdate,
  adminAuthRegister,
  adminAuthLogin,
} from "./auth";
import { expect, test, describe, beforeEach } from "@jest/globals";
import { error } from "./interface";

describe("adminUserPasswordUpdate", () => {
  let userId: number;
  const email: string = "john@gmail.com";
  const nameFirst: string = "John";
  const nameLast: string = "Smith";
  const originalPassword: string = "Brooklyn99";
  const invalidId: number = -1;

  beforeEach(() => {
    clear();
    const userObject = adminAuthRegister(
      email,
      originalPassword,
      nameFirst,
      nameLast
    );
    if (typeof userObject === "object" && "authUserId" in userObject) {
      userId = userObject.authUserId;
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
        adminUserPasswordUpdate(userId, originalPassword, "Brooklyn98")
      ).toStrictEqual({});
      expect(adminAuthLogin("john@gmail.com", "Brooklyn98")).not.toStrictEqual({
        error: expect.any(String),
      });
    });
  });

  describe("failure cases", () => {
    test("authUserId is not valid.", () => {
      expect(
        adminUserPasswordUpdate(invalidId, originalPassword, "Brooklyn98")
      ).not.toStrictEqual({});
    });

    test("Old Password is not the correct old password", () => {
      expect(
        adminUserPasswordUpdate(invalidId, "Brooklyn981", "Brooklyn98")
      ).not.toStrictEqual({});
    });

    test("Old Password and New Password match exactly", () => {
      expect(
        adminUserPasswordUpdate(invalidId, originalPassword, "Brooklyn99")
      ).not.toStrictEqual({});
    });

    test("New Password has already been used before by this user", () => {
      adminUserPasswordUpdate(userId, originalPassword, "AnotherTvShow1");
      expect(
        adminUserPasswordUpdate(userId, "AnotherTvShow1", originalPassword)
      ).not.toStrictEqual({});
    });

    test("New Password is less than 8 characters", () => {
      expect(
        adminUserPasswordUpdate(invalidId, originalPassword, "boo1")
      ).not.toStrictEqual({});
    });

    test("New Password does not contain at least one number and at least one letter", () => {
      expect(
        adminUserPasswordUpdate(invalidId, originalPassword, "Brooklynninenien")
      ).not.toStrictEqual({});
    });
  });
});
