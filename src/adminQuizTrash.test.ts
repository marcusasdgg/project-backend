import { describe, expect, test, beforeEach } from "@jest/globals";
import { clearHelper, adminAuthRegisterHelper, adminQuizListHelper, adminQuizCreateHelper, adminQuizRemoveHelper, adminQuizTrashHelper } from "./httpHelperFunctions";
import { quiz } from "./interface";

describe("adminQuizTrash", () => {
  let sessionId: number;

  beforeEach(() => {
    clearHelper();
    
  });

  describe("Successsful Cases", () => {
    
    
    test("view quiz after deletion successfully", () => {
      // expect().toStrictEqual({});

      // register
      // create quiz
      // delete quiz
      // call function
    });

    test("viewing quizzes in trash after invalid quizRestore", () => {
      // expect().toStrictEqual({});

      // register
      // create quiz
      // delete quiz
      // invalid restore
      // call function
    });
  });

  describe("Failure Cases", () => {
    test("token is invalid (does not refer to valid logged in user session)", () => {
      // expect().toStrictEqual({});
    });
  });
    
});