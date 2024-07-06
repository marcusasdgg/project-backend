
import { describe, expect, test, beforeEach } from "@jest/globals";
import { error } from "./interface";
import { adminAuthRegisterHelper, clearHelper,adminUserDetailsHelper } from "./httpHelperFunctions";
//this is the test suite for admin auth register functionality located from auth.js
describe("AdminAuthRegister", () => {
  beforeEach(() => {
    clearHelper();
  });

  describe("success Cases", () => {
    test("registering twice with the same email but separated by clear", () => {
      adminAuthRegisterHelper("a@gmail.com", "abcdefgh1", "asd", "abcde");
      const retcondition: {} = clearHelper();
      expect(retcondition).toStrictEqual({});
      const ifError = adminAuthRegisterHelper(
        "a@gmail.com",
        "abcdefgh1",
        "asd",
        "abcde"
      );
      expect(ifError).toStrictEqual({ sessionId: expect.any(Number) });
    });

    test("normal test case with normal inputs.", () => {
      const id: { sessionId: number } | error = adminAuthRegisterHelper(
        "a@gmail.com",
        "abcdefg1",
        "asd a",
        "abcde"
      );
      expect(id).not.toStrictEqual({ error: expect.any(String) });
      if ("sessionId" in id) {
        expect(adminUserDetailsHelper(id.sessionId)).not.toStrictEqual({
          error: expect.any(String),
        });
      }
    });
  });
  describe("failure Cases", () => {
    test("failure case with everything good but invalid email.", () => {
      const id = adminAuthRegisterHelper("a@.com", "abcdefgh1", "asd", "abcde");
      expect(id).toStrictEqual({ error: expect.any(String) });
    });

    test("failure case with everything good but email used by different user.", () => {
      const id = adminAuthRegisterHelper("a@gmail.com", "abcdefgh1", "asd", "abcde");
      expect(id).not.toStrictEqual({ error: expect.any(String) });

      if ("sessionId" in id) {
        expect(adminUserDetailsHelper(id.sessionId)).not.toStrictEqual({
          error: expect.any(String),
        });
      }
      const idsecond = adminAuthRegisterHelper(
        "a@gmail.com",
        "abcdefgh1",
        "asd",
        "abcde"
      );
      expect(idsecond).toStrictEqual({ error: expect.any(String) });
    });

    test("failure case with everything good but name first and last contains symbols.", () => {
      const id = adminAuthRegisterHelper(
        "a@gmail.com",
        "abcdefgh1",
        "asd%",
        "abcde%"
      );
      expect(id).toStrictEqual({ error: expect.any(String) });
    });

    test("failure case with everything good but name first and last contains symbols.", () => {
      const id = adminAuthRegisterHelper(
        "a@gmail.com",
        "abcdefgh1",
        "asd%",
        "abcde%"
      );
      expect(id).toStrictEqual({ error: expect.any(String) });
    });

    test("failure case with everything good but name first and last contains less than 2 characters.", () => {
      const id = adminAuthRegisterHelper("a@gmail.com", "abcdefgh1", "a", "a");
      expect(id).toStrictEqual({ error: expect.any(String) });
    });

    test("failure case with everything good but name first and last contains more than 20 characters.", () => {
      const id = adminAuthRegisterHelper(
        "a@gmail.com",
        "abcdefgh1",
        "abcdefghijklmnopqrstuvwxyz",
        "abcdefghijklmnopqrstuvwxyz"
      );
      expect(id).toStrictEqual({ error: expect.any(String) });
    });

    test("failure case with everything good but password contains less than 8 characters.", () => {
      const id = adminAuthRegisterHelper(
        "a@gmail.com",
        "abc1",
        "abcdefghijklmnopqrstuvwxyz",
        "abcdefghijklmnopqrstuvwxyz"
      );
      expect(id).toStrictEqual({ error: expect.any(String) });
    });

    test("failure case with everything good but password doesnt contain a number but just characters.", () => {
      const id = adminAuthRegisterHelper(
        "a@gmail.com",
        "abcdefgh",
        "abc1",
        "abcdefghijklmnopqrstuvwxyz"
      );
      expect(id).toStrictEqual({ error: expect.any(String) });
    });

    test("failure case with everything good but password doesnt contain a character but just numbers.", () => {
      const id = adminAuthRegisterHelper(
        "a@gmail.com",
        "abcdefgh",
        "12345678",
        "abcdefghijklmnopqrstuvwxyz"
      );
      expect(id).toStrictEqual({ error: expect.any(String) });
    });
  });
});
