import { describe, expect, test, beforeEach } from "@jest/globals";
import { adminQuizDescriptionUpdate, adminQuizCreate, adminQuizInfo } from "./quiz";
import { adminAuthRegister } from "./auth";
import { clear } from "./other"

describe("QuizDescriptionUpdate", () => {
  let validAuthUserId1;
  let validAuthUserId2;
  let validQuizId;

  const validDescription = "This description is 38 characters long";
  const extremeValidDescription =
    "This is a new description for this reeally fun Tookah quiz for" +
    "comp1511 students to start attending.";

  const invalidAuthUserId = -134534;
  const invalidQuizId = -133753;
  const invalidDescription =
    "This is a newer description for this really fun Tookah quiz for students to start attending lectures hahahah.";

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

    validQuizId = adminQuizCreate(validAuthUserId1, "Games", "Game Trivia!").quizId;

  });

  
  
  describe("Success Cases", () => {
    test("all parameters valid", () => {
      expect(
        adminQuizDescriptionUpdate(
          validAuthUserId1,
          validQuizId,
          validDescription
        )
      ).toStrictEqual({});
    });

    test("description length = 100, all other parementers valid", () => {
      expect(
        adminQuizDescriptionUpdate(
          validAuthUserId1,
          validQuizId,
          extremeValidDescription
        )
      ).toStrictEqual({});
    });

    test("description length = 0, all other parementers valid", () => {
      expect(
        adminQuizDescriptionUpdate(validAuthUserId1, validQuizId, "")
      ).toStrictEqual({});
    });

    test("description changed", () => {
      adminQuizDescriptionUpdate(
        validAuthUserId1,
        validQuizId,
        validDescription
      );
      expect(adminQuizInfo(validAuthUserId1, validQuizId).description).toStrictEqual(
        validDescription
      );
    });

    test("time changed", () => {
      const quizDetails = adminQuizInfo(validAuthUserId1, validQuizId);
      adminQuizDescriptionUpdate(
        validAuthUserId1,
        validQuizId,
        validDescription
      );
      expect(
        adminQuizInfo(validAuthUserId1, validQuizId).timeLastEdited
      ).toBeGreaterThan(quizDetails.timeLastEdited);
    });
  });

  describe("Failure Cases", () => {
    test("authUserId not valid all other parementers valid", () => {
      expect(
        adminQuizDescriptionUpdate(
          invalidAuthUserId,
          validQuizId,
          validDescription
        )
      ).toStrictEqual({ error: "provided authUserId is not a real user." });
    });
  
    test("quizId not valid all other parementers valid", () => {
      expect(
        adminQuizDescriptionUpdate(
          validAuthUserId1,
          invalidQuizId,
          validDescription
        )
      ).toStrictEqual({ error: "provided quizId is not a real quiz." });
    });
  
    test("quizId valid but not owned by user provided by authUserId all other parementers valid", () => {
      expect(
        adminQuizDescriptionUpdate(
          validAuthUserId2,
          validQuizId,
          validDescription
        )
      ).toStrictEqual({ error: "provided quizId is not owned by current user." });
    });
  
    test("description length > 100, all other parementers valid", () => {
      expect(
        adminQuizDescriptionUpdate(
          validAuthUserId1,
          validQuizId,
          invalidDescription
        )
      ).toStrictEqual({error: "description is invalid." });
    });
  
    test("all parameters are invalid", () => {
      expect(
        adminQuizDescriptionUpdate(
          invalidAuthUserId,
          invalidQuizId,
          invalidDescription
        )
      ).toStrictEqual({ error: "provided authUserId is not a real user." });
    });
  
    test("authUserId is valid, all other parementers invalid", () => {
      expect(
        adminQuizDescriptionUpdate(
          validAuthUserId1,
          invalidQuizId,
          invalidDescription
        )
      ).toStrictEqual({error: "provided quizId is not a real quiz."});
    });
  
    test("quizId is valid, all other parementers invalid", () => {
      expect(
        adminQuizDescriptionUpdate(
          invalidAuthUserId,
          validQuizId,
          invalidDescription
        )
      ).toStrictEqual({ error: "provided authUserId is not a real user." });
    });
  
    test("description is valid, all other parementers invalid", () => {
      expect(
        adminQuizDescriptionUpdate(
          invalidAuthUserId,
          invalidQuizId,
          validDescription
        )
      ).toStrictEqual({ error: "provided authUserId is not a real user." });
    });

    test("description not changed", () => {
      adminQuizDescriptionUpdate(
        validAuthUserId1,
        validQuizId,
        invalidDescription
      );
      expect(
        adminQuizInfo(validAuthUserId1, validQuizId).description
      ).not.toStrictEqual(invalidDescription);
    });

    test("time not changed", () => {
      const quizDetails = adminQuizInfo(validAuthUserId1, validQuizId);
      adminQuizDescriptionUpdate(
        validAuthUserId1,
        validQuizId,
        invalidDescription
      );
      expect(
        adminQuizInfo(validAuthUserId1, validQuizId).timeLastEdited
      ).toStrictEqual(quizDetails.timeLastEdited);
    });
  });
});
