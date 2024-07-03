import { describe, expect, test, beforeEach } from "@jest/globals";
import { clear } from "./other";
import { adminQuizNameUpdate, adminQuizCreate, adminQuizInfo } from "./quiz";
import { adminAuthRegister } from "./auth";
import { quizInfoReturn } from "./interface";

describe("QuizNameUpdate", () => {
  let validAuthUserId1: number;
  let validAuthUserId2: number;
  let validQuizId1: number;
  let validQuizId2: number;
  let invalidAuthUserId: number;
  let invalidQuizId: number;

  const validName: string = "Numbers";
  const extremeValidName1: string = "fun";
  const extremeValidName2: string = "1Very Extreme Name For a Quiz1";

  const invalidName1: string = "Almost a valid Name...";
  const invalidName2: string = "fu";
  const invalidName3: string = "10Very Extreme Name For a Quiz01";

  beforeEach(() => {
    clear();

    const registerResponse1 = adminAuthRegister(
      "user1@tookah.com",
      "iL0veT00kah",
      "Brian",
      "Bones"
    );

    if ("authUserId" in registerResponse1) {
      validAuthUserId1 = registerResponse1.authUserId;
    }

    const registerResponse2 = adminAuthRegister(
      "user2@tookah.com",
      "iLHateT00kah",
      "Bob",
      "Jones"
    );

    if ("authUserId" in registerResponse2) {
      validAuthUserId2 = registerResponse2.authUserId;
    }

    const quizCreateResponse1 = adminQuizCreate(
      validAuthUserId1,
      "Games",
      "Game Trivia!"
    );

    if ("quizId" in quizCreateResponse1) {
      validQuizId1 = quizCreateResponse1.quizId;
    }

    const quizCreateResponse2 = adminQuizCreate(
      validAuthUserId1,
      "Fruit or Cake",
      "Is it a fruit or cake?"
    );

    if ("quizId" in quizCreateResponse2) {
      validQuizId2 = quizCreateResponse2.quizId;
    }
    invalidAuthUserId = validAuthUserId1 + validAuthUserId2 + 1;
    invalidQuizId = validQuizId1 + validQuizId2 + 1;
  });

  describe("Success Cases", () => {
    test("all parameters valid", () => {
      expect(
        adminQuizNameUpdate(validAuthUserId1, validQuizId1, validName)
      ).toStrictEqual({});
    });

    test("name is = 3 characters long, all other parameters valid", () => {
      expect(
        adminQuizNameUpdate(validAuthUserId1, validQuizId1, extremeValidName1)
      ).toStrictEqual({});
    });

    test("name is = 30 characters long, all other parameters valid", () => {
      expect(
        adminQuizNameUpdate(validAuthUserId1, validQuizId1, extremeValidName2)
      ).toStrictEqual({});
    });

    test("name changed", () => {
      adminQuizNameUpdate(validAuthUserId1, validQuizId1, validName);

      const info = adminQuizInfo(validAuthUserId1, validQuizId1);
      if ("name" in info) {
        expect(info.name).toStrictEqual(validName);
      }
    });
  });

  describe("Failure Cases", () => {
    test("authUserId not valid, all other parameters valid", () => {
      expect(
        adminQuizNameUpdate(invalidAuthUserId, validQuizId1, validName)
      ).toStrictEqual({ error: "provided authUserId is not a real user." });
    });

    test("quizId not valid, all other parameters valid", () => {
      expect(
        adminQuizNameUpdate(validAuthUserId1, invalidQuizId, validName)
      ).toStrictEqual({ error: "provided quizId is not a real quiz." });
    });

    test("quizId valid, but not owned by user provided by authUserId, all other parementers valid", () => {
      expect(
        adminQuizNameUpdate(validAuthUserId2, validQuizId1, validName)
      ).toStrictEqual({
        error: "provided quizId is not owned by current user.",
      });
    });

    test("no name, all other parameters valid", () => {
      expect(
        adminQuizNameUpdate(validAuthUserId1, validQuizId1, "")
      ).toStrictEqual({ error: "name is invalid." });
    });

    test("name contains none alphanumeric and space characters, all other parameters valid", () => {
      expect(
        adminQuizNameUpdate(validAuthUserId1, validQuizId1, invalidName1)
      ).toStrictEqual({ error: "name is invalid." });
    });

    test("name is < 3 characters long, all other parameters valid", () => {
      expect(
        adminQuizNameUpdate(validAuthUserId1, validQuizId1, invalidName2)
      ).toStrictEqual({ error: "name is invalid." });
    });

    test("name is > 30 characters long, all other parameters valid", () => {
      expect(
        adminQuizNameUpdate(validAuthUserId1, validQuizId1, invalidName3)
      ).toStrictEqual({ error: "name is invalid." });
    });

    test("name valid but already in use for another quiz, all other parameters valid", () => {
      expect(
        adminQuizNameUpdate(validAuthUserId1, validQuizId1, "Games")
      ).toStrictEqual({ error: "name is being used for another quiz." });
    });

    test("name the same as current name, all other parameters valid", () => {
      expect(
        adminQuizNameUpdate(validAuthUserId1, validQuizId1, "Games")
      ).toStrictEqual({ error: "name is being used for another quiz." });
    });

    test("name not changed", () => {
      adminQuizNameUpdate(validAuthUserId1, validQuizId1, invalidName1);

      const info = adminQuizInfo(validAuthUserId1, validQuizId1);
      if ("name" in info) {
        expect(info.name).not.toStrictEqual(invalidName1);
      }
    });

    test("time not changed", () => {
      const info = adminQuizInfo(validAuthUserId1, validQuizId1);

      adminQuizNameUpdate(validAuthUserId1, validQuizId1, invalidName1);

      if ("timeLastEdited" in info) {
        const info2 = adminQuizInfo(validAuthUserId1, validQuizId1);
        if ("timeLastEdited" in info2) {
          expect(info2.timeLastEdited).toStrictEqual(info.timeLastEdited);
        }
      }
    });
  });
});
