import { describe, expect, test, beforeEach } from "@jest/globals";
import { clearHelper, adminAuthRegisterHelper, adminQuizListHelper, adminQuizCreateHelper, adminQuizRemoveHelper, adminQuizTrashHelper } from "./httpHelperFunctions";
import { quiz } from "./interface";

describe("adminQuizTrash", () => {
  let sessionId: number;

  beforeEach(() => {
    clearHelper();
    
  });

  describe("Successsful Cases", () => {
    
    
    test("view quiz successfully", () => {
      // expect().toStrictEqual({});
    });
    
    test("viewing quiz after deletion", () => {
      // expect().toStrictEqual({});
    });

    test("viewing quiz after transfer", () => {
      // expect().toStrictEqual({});
    });

    test("viewing quiz after restore", () => {
      // expect().toStrictEqual({});
    });

    test("viewing quiz after it has been restored", () => {
      // expect().toStrictEqual({});
    });

    test("viewing quizzes in trash after invalid quizRemove", () => {
      // expect().toStrictEqual({});
    });

    test("adding multiple quizes with different sessionIds", () => {
      // expect().toStrictEqual({});
    });

    test("adding multiple quizes with different sessions Ids, clearing trash and viewing", () => {
      // expect().toStrictEqual({});
    });

    test("", () => {
      // expect().toStrictEqual({});
    });
    
  });

  describe("Failure Cases", () => {
    test("token is invalid (does not refer to valid logged in user session)", () => {
      // expect().toStrictEqual({});
    });
  });
    
});