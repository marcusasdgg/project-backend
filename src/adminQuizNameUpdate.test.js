import { describe, expect, test, beforeEach } from "@jest/globals";
import { clear } from "./other";
import { adminQuizNameUpdate, adminQuizCreate, adminQuizInfo } from "./quiz";
import { adminAuthRegister } from "./auth";

describe("QuizNameUpdate", () => {
  let validAuthUserId1;
  let validAuthUserId2;
  let validQuizId1;
  let validQuizId2;

  const validName = "Numbers";
  const extremeValidName1 = "fun";
  const extremeValidName2 = "1Very Extreme Name For a Quiz1";
  const invalidAuthUserId = -1;
  const invalidQuizId = -1;
  const invalidName1 = "Almost a valid Name...";
  const invalidName2 = "fu";
  const invalidName3 = "10Very Extreme Name For a Quiz01";

  beforeEach(() => {
    clear();

    validAuthUserId1 = adminAuthRegister(
      "user1@tookah.com",
      "iL0veT00kah",
      "Brian",
      "Bones"
    ).authUserId;

    validAuthUserId2 = adminAuthRegister(
      "user2@tookah.com",
      "iLHateT00kah",
      "Bob",
      "Jones"
    ).authUserId;

    validQuizId1 = adminQuizCreate(
      validAuthUserId1,
      "Games",
      "Game Trivia!"
    ).quizId;

    validQuizId2 = adminQuizCreate(
      validAuthUserId1,
      "Fruit or Cake",
      "Is it a fruit or cake?"
    ).quizId;
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
      expect(adminQuizInfo(validAuthUserId1, validQuizId1).name).toStrictEqual(
        validName
      );
    });

    test("time changed", () => {
      const quizDetails = adminQuizInfo(validAuthUserId1, validQuizId1);
      adminQuizNameUpdate(validAuthUserId1, validQuizId1, validName);
      expect(
        adminQuizInfo(validAuthUserId1, validQuizId1).timeLastEdited
      ).toBeGreaterThan(quizDetails.timeLastEdited);
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
        adminQuizNameUpdate(
          validAuthUserId1,
          validQuizId1,
          adminQuizInfo(validAuthUserId1, validQuizId2).name
        )
      ).toStrictEqual({ error: "name is being used for another quiz." });
    });

    test("name the same as current name, all other parameters valid", () => {
      expect(
        adminQuizNameUpdate(
          validAuthUserId1,
          validQuizId1,
          'adminQuizInfo(validAuthUserId1, validQuizId1).name'
        )
      ).toStrictEqual({error: "name is being used for another quiz." });
    });

    test("name not changed", () => {
      adminQuizNameUpdate(validAuthUserId1, validQuizId1, invalidName1);
      expect(
        adminQuizInfo(validAuthUserId1, validQuizId1).name
      ).not.toStrictEqual(invalidName1);
    });

    test("time not changed", () => {
      const quizDetails = adminQuizInfo(validAuthUserId1, validQuizId1);
      adminQuizNameUpdate(validAuthUserId1, validQuizId1, invalidName1);
      expect(
        adminQuizInfo(validAuthUserId1, validQuizId1).timeLastEdited
      ).toStrictEqual(quizDetails.timeLastEdited);
    });
  });
});
